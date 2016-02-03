- namespace [%fileName%]

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

- template [%fileName%](text)
	- tagName = 'div'
	- className = ''
	- block root
		< ${tagName}.${className}
			- block body
				{text}
