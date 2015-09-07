/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

var
	$C = require('collection.js').$C;

var
	loaderUtils = require('loader-utils'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify');

module.exports = function (source) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		opts = loaderUtils.parseQuery(this.query),
		tpls = {};

	opts = $C(opts).reduce(function (map, val, key) {
		map[key] = parse(val);
		return map;
	}, {});

	var prettyPrint;
	if (opts.exec) {
		if (opts.prettyPrint) {
			opts.prettyPrint = false;
			prettyPrint = true;
		}

		opts.context = tpls;
	}

	opts.exports = 'none';
	opts.throws = true;

	var
		file = loaderUtils.getRemainingRequest(this),
		res = snakeskin.compile(source, opts, {file: file});

	if (opts.exec) {
		res = snakeskin.returnMainTpl(tpls, file, opts.tpl) || '';

		if (res) {
			res = res(opts.data);

			if (prettyPrint) {
				res = beautify['html'](res);
				res = res.replace(/\r?\n|\r/g, opts.lineSeparator);
			}

			res += opts.lineSeparator;
		}
	}

	return res;
};

function parse(val) {
	try {
		if (typeof val === 'object') {
			$C(val).forEach(function (el, key) {
				val[key] = new Function(
					'module',
					'exports',
					'require',
					'__filename',
					'__dirname',
					'return ' + el

				)(parent, parent.exports, parent.require, parent.filename, path.dirname(parent.filename));
			});
		}

		return val;

	} catch (ignore) {
		return val;
	}
}
