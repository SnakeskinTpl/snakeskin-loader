'use strict';

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

const
	$C = require('collection.js/compiled');

const
	fs = require('fs'),
	path = require('path'),
	loaderUtils = require('loader-utils'),
	snakeskin = require('snakeskin'),
	beautify = require('js-beautify');

module.exports = function (source) {
	const
		ssRC = path.join(process.cwd(), '.snakeskinrc'),
		cb = this.async();

	const opts = Object.assign(
		{
			module: 'cjs',
			eol: '\n',
			pack: true
		},

		fs.existsSync(ssRC) && snakeskin.toObj(ssRC),
		loaderUtils.getOptions(this)
	);

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
