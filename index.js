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
	snakeskin = require('snakeskin');

module.exports = function (source) {
	if (this.cacheable) {
		this.cacheable();
	}

	var
		opts = loaderUtils.parseQuery(this.query),
		optsIsObj = /^\?(?:\{|\[)/.test(this.query);

	if (!optsIsObj) {
		opts = $C(opts).reduce(function (map, val, key) {
			try {
				map[key] = eval('(' + val + ')');

			} catch (ignore) {
				map[key] = val;
			}

			return map;
		}, {});
	}

	opts.exports = 'none';
	opts.throws = true;

	return snakeskin.compile(source, opts, {file: loaderUtils.getRemainingRequest(this)});
};
