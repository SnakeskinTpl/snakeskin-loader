'use strict';

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

const
	$C = require('collection.js/compiled'),
	parent = module.parent;

const
	path = require('path'),
	loaderUtils = require('loader-utils'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify'),
	exists = require('exists-sync');

module.exports = function (source) {
	this.cacheable && this.cacheable();

	const
		ssrc = path.join(process.cwd(), '.snakeskinrc'),
		cb = this.async();

	let opts = loaderUtils.parseQuery(this.query);
	if (!this.query && exists(ssrc)) {
		opts = snakeskin.toObj(ssrc);
	}

	opts = $C(opts).reduce((map, val, key) => {
		map[key] = parse(val);
		return map;

	}, Object.assign({
		module: 'cjs',
		eol: '\n',
		pack: true
	}, this.options.snakeskin));

	const
		eol = opts.eol,
		prettyPrint = opts.prettyPrint,
		nRgxp = /\r?\n|\r/g;

	if (opts.exec && opts.prettyPrint) {
		opts.prettyPrint = false;
	}

	opts.debug = {};
	opts.cache = false;
	opts.throws = true;

	const
		file = this.resourcePath,
		info = {file};

	const cache = () => {
		$C(opts.debug.files).forEach((bool, filePath) => this.addDependency(filePath));
	};

	if (opts.adapter || opts.jsx) {
		return require(opts.jsx ? 'ss2react' : opts.adapter).adapter(source, opts, info).then(
			(res) => {
				cache();
				cb(null, res);
			},

			(err) => {
				cb(err);
			}
		);
	}

	try {
		const
			tpls = {};

		if (opts.exec) {
			opts.module = 'cjs';
			opts.context = tpls;
		}

		let res = snakeskin.compile(source, opts, info);
		cache();

		if (opts.exec) {
			res = snakeskin.getMainTpl(tpls, info.file, opts.tpl) || '';

			if (res) {
				return snakeskin.execTpl(res, opts.data).then(
					(res) => {
						if (prettyPrint) {
							res = beautify.html(res);
						}

						cb(null, res.replace(nRgxp, eol) + eol);
					},

					(err) => {
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
		`return ${str}`

	)(parent, parent.exports, parent.require, parent.filename, path.dirname(parent.filename));
}

function parse(val) {
	try {
		if (typeof val === 'object') {
			$C(val).set((el) => toJS(el));
			return val;
		}

		return toJS(val);

	} catch (ignore) {
		return val;
	}
}
