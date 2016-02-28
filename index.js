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

	if (!opts && exists(ssrc)) {
		opts = snakeskin.toObj(ssrc);
	}

	opts = $C(opts).reduce(function (map, val, key) {
		map[key] = parse(val);
		return map;

	}, {debug: {}, module: 'cjs', eol: '\n'});

	var prettyPrint;
	if (opts.exec) {
		if (opts.prettyPrint) {
			opts.prettyPrint = false;
			prettyPrint = true;
		}

		opts.context = tpls;
	}

	opts.cache = false;
	opts.throws = true;

	var
		file = this.resourcePath,
		res = snakeskin.compile(source, opts, {file: file}),
		_this = this;

	$C(opts.debug.files).forEach(function (bool, filePath) {
		_this.addDependency(filePath);
	});

	if (opts.exec) {
		res = snakeskin.getMainTpl(tpls, file, opts.tpl) || '';

		if (res) {
			res = res(opts.data);

			if (prettyPrint) {
				res = beautify['html'](res);
				res = res.replace(/\r?\n|\r/g, opts.eol);
			}

			res += opts.eol;
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
