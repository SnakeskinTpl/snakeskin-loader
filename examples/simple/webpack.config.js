'use strict';

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
				loader: 'snakeskin',
				query: {
					doctype: 'html',
					prettyPrint: true
				}
			}
		]
	},

	resolveLoader: {
		alias: {
			'snakeskin': path.resolve(__dirname, '../../index.js')
		}
	}
};
