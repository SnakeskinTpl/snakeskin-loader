/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

var
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
				loader: 'snakeskin',
				query: {
					prettyPrint: true
				}
			}
		]
	},

	resolveLoader: {
		alias: {
			'snakeskin': path.resolve(__dirname, '../../index.js')
		}
	},

	externals: {
		'snakeskin': 'Snakeskin'
	}
};
