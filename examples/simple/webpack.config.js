'use strict';

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

const
	path = require('path');

module.exports = {
	context: __dirname,
	entry: './index.js',

	output: {
		path: __dirname,
		filename: 'index.build.js'
	},

	module: {
		loaders: [
			{
				test: /.ss$/,
				loader: 'snakeskin'
			}
		]
	},

	resolveLoader: {
		alias: {
			'snakeskin': path.resolve(__dirname, '../../index.js')
		}
	}
};
