- namespace [%fileName%]

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

- include './block' as placeholder
- template [%fileName%](text) extends ['block']['block']
	- tagName = 'h1'
	- className = 'header'
	- block body
		< span
			Article:
		- super
