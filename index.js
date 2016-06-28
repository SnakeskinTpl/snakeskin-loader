/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

require('core-js/es6/object');

var
	$C = require('collection.js').$C,
	parent = module.parent;

var
	path = require('path'),
	loaderUtils = require('loader-utils'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (source) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		ssrc = path.join(process.cwd(), '.snakeskinrc'),
		opts = loaderUtils.parseQuery(this.query),
		cb = this.async();

	if (!this.query && exists(ssrc)) {
		opts = snakeskin.toObj(ssrc);
	}

	opts = $C(opts).reduce(function (map, val, key) {
		map[key] = parse(val);
		return map;

	}, Object.assign({
		module: 'cjs',
		eol: '\n',
		pack: true
	}, this.options.snakeskin));

	var
		eol = opts.eol,
		prettyPrint = opts.prettyPrint,
		nRgxp = /\r?\n|\r/g;

	if (opts.exec && opts.prettyPrint) {
		opts.prettyPrint = false;
	}

	opts.debug = {};
	opts.cache = false;
	opts.throws = true;

	var
		file = this.resourcePath,
		info = {file: file},
		that = this;

	function cache() {
		$C(opts.debug.files).forEach(function (bool, filePath) {
			that.addDependency(filePath);
		});
	}

	if (opts.adapter || opts.jsx) {
		return require(opts.jsx ? 'ss2react' : opts.adapter).adapter(source, opts, info).then(
			function (res) {
				cache();
				cb(null, res);
			},

			function (err) {
				cb(err);
			}
		);
	}

	try {
		var tpls = {};

		if (opts.exec) {
			opts.module = 'cjs';
			opts.context = tpls;
		}

		var res = snakeskin.compile(source, opts, info);
		cache();

		if (opts.exec) {
			res = snakeskin.getMainTpl(tpls, info.file, opts.tpl) || '';

			if (res) {
				return snakeskin.execTpl(res, opts.data).then(
					function (res) {
						if (prettyPrint) {
							res = beautify.html(res);
						}

						cb(null, res.replace(nRgxp, eol) + eol);
					},

					function (err) {
						cb(err);
					}
				);
			}
		}

		cb(null, res);

	} catch (err) {
		return cb(err);
	}
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
