/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

var
	$C = require('collection.js').$C,
	parent = module.parent;

var
	path = require('path'),
	loaderUtils = require('loader-utils'),
	snakeskin = require('snakeskin'),
	babel = require('babel-core'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (source) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		ssrc = path.join(process.cwd(), '.snakeskinrc'),
		opts = loaderUtils.parseQuery(this.query),
		tpls = {};

	if (!this.query && exists(ssrc)) {
		opts = snakeskin.toObj(ssrc);
	}

	opts = $C(opts).reduce(function (map, val, key) {
		map[key] = parse(val);
		return map;

	}, {
		module: 'cjs',
		moduleId: 'tpls',
		useStrict: true,
		eol: '\n',
		pack: true
	});

	var
		eol = opts.eol,
		mod = opts.module,
		useStrict = opts.useStrict ? '"useStrict";' : '',
		prettyPrint = opts.prettyPrint,
		nRgxp = /\r?\n|\r/g;

	if (opts.jsx || opts.exec) {
		opts.module = 'cjs';
	}

	if (opts.jsx) {
		opts.literalBounds = ['{', '}'];
		opts.renderMode = 'stringConcat';
		opts.context = tpls;
		opts.exec = false;

	} else if (opts.exec) {
		if (opts.prettyPrint) {
			opts.prettyPrint = false;
		}

		opts.context = tpls;
	}

	opts.debug = {};
	opts.cache = false;
	opts.throws = true;

	var
		file = this.resourcePath,
		res = snakeskin.compile(source, opts, {file: file}),
		that = this;

	$C(opts.debug.files).forEach(function (bool, filePath) {
		that.addDependency(filePath);
	});

	function testId(id) {
		try {
			var obj = {};
			eval('obj.' + id + '= true');
			return true;

		} catch (ignore) {
			return false;
		}
	}

	function compileJSX(tpls, prop) {
		prop = prop || 'exports';
		$C(tpls).forEach(function (el, key) {
			var
				val,
				validKey = false;

			if (testId(key)) {
				val = prop + '.' + key;
				validKey = true;

			} else {
				val = prop + '["' + key.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]';
			}

			if (typeof el !== 'function') {
				res +=
					'if (' + val + ' instanceof Object === false) {' +
						val + ' = {};' +
						(validKey && mod === 'native' ? 'export var ' + key + '=' + val + ';' : '') +
					'}'
				;

				return compileJSX(el, val);
			}

			var decl = /function .*?\)\s*\{/.exec(el.toString());
			res += babel.transform(val + ' = ' + decl[0] + ' ' + el(opts.data) + '};', {
				babelrc: false,
				plugins: [
					require('babel-plugin-syntax-jsx'),
					require('babel-plugin-transform-react-jsx'),
					require('babel-plugin-transform-react-display-name')
				]
			}).code;
		});
	}

	if (opts.jsx) {
		res = /\/\*[\s\S]*?\*\//.exec(res)[0];

		if (mod === 'native') {
			res +=
				useStrict +
				'import React from "react";' +
				'var exports = {};' +
				'export default exports;'
			;

		} else {
			res +=
				'(function(global, factory) {' +
					(
						{cjs: true, umd: true}[mod] ?
							'if (typeof exports === "object" && typeof module !== "undefined") {' +
								'factory(exports, typeof React === "undefined" ? require("react") : React);' +
								'return;' +
							'}' :
							''
					) +

					(
						{amd: true, umd: true}[mod] ?
							'if (typeof define === "function" && define.amd) {' +
								'define("' + (opts.moduleId) + '", ["exports", "react"], factory);' +
								'return;' +
							'}' :
							''
					) +

					(
						{global: true, umd: true}[mod] ?
							'factory(global' + (opts.moduleName ? '.' + opts.moduleName + '= {}' : '') + ', React);' :
							''
					) +

				'})(this, function (exports, React) {' +
					useStrict
			;
		}

		compileJSX(tpls);
		if (mod !== 'native') {
			res += '});';
		}

		if (prettyPrint) {
			res = beautify.js(res);
		}

		res = res.replace(nRgxp, eol) + eol;

	} else if (opts.exec) {
		res = snakeskin.getMainTpl(tpls, file, opts.tpl) || '';

		if (res) {
			res = res(opts.data);

			if (prettyPrint) {
				res = beautify.html(res);
			}

			res = res.replace(nRgxp, eol) + eol;
		}
	}

	return res;
};

function toJS(str) {
	return new Function(
		'module',
		'exports',
		'require',
		'__filename',
		'__dirname',
		'return ' + str

	)(parent, parent.exports, parent.require, parent.filename, path.dirname(parent.filename));
}

function parse(val) {
	try {
		if (typeof val === 'object') {
			$C(val).forEach(function (el, key) {
				val[key] = toJS(el);
			});

			return val;
		}

		return toJS(val);

	} catch (ignore) {
		return val;
	}
}
