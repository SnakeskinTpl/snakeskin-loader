- namespace [%fileName%]

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

- include './block'
- include './header'
- include './body'

- template [%fileName%](title, content) extends ['block']['block']
	- className = 'article'
	- block body
		- call exports['header']['header'](title)
		- call exports['body']['body'](content)
