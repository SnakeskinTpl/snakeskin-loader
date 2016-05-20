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
		tpls = {},
		prettyPrint;

	if (!this.query && exists(ssrc)) {
		opts = snakeskin.toObj(ssrc);
	}

	opts = $C(opts).reduce(function (map, val, key) {
		map[key] = parse(val);
		return map;

	}, {debug: {}, module: 'cjs', eol: '\n'});

	if (opts.jsx) {
		opts.literalBounds = ['{', '}'];
		opts.renderMode = 'stringConcat';
		opts.context = tpls;
		opts.exec = false;

	} else if (opts.exec) {
		if (opts.prettyPrint) {
			opts.prettyPrint = false;
			prettyPrint = true;
		}

		opts.context = tpls;
	}

	opts.cache = false;
	opts.throws = true;
	opts.pack = opts.pack !== undefined ? opts.pack : true;

	var
		file = this.resourcePath,
		res = snakeskin.compile(source, opts, {file: file}),
		n = opts.eol,
		that = this;

	$C(opts.debug.files).forEach(function (bool, filePath) {
		that.addDependency(filePath);
	});

	function compileJSX(tpls, prop) {
		prop = prop || 'exports';
		$C(tpls).forEach(function (el, key) {
			var val = prop + '["' + key.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]';

			if (typeof el !== 'function') {
				res += 'if (' + val + ' instanceof Object === false) {' + n + '\t' + val + ' = {};' + n + '}' + n + n;
				return compileJSX(el, val);
			}

			var decl = /function .*?\)\s*\{/.exec(el.toString());
			res += babel.transform(val + ' = ' + decl[0] + ' ' + el(opts.data) + '};', {plugins: [
				'syntax-jsx',
				'transform-react-jsx',
				'transform-react-display-name'
			]}).code;
		});
	}

	if (opts.jsx) {
		res = 'var React = require("react");' + n + n;
		compileJSX(tpls);

	} else if (opts.exec) {
		res = snakeskin.getMainTpl(tpls, file, opts.tpl) || '';

		if (res) {
			res = res(opts.data);

			if (prettyPrint) {
				res = beautify['html'](res);
				res = res.replace(/\r?\n|\r/g, n);
			}

			res += n;
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
