- namespace [%fileName%]

/*!
 * snakeskin-loader
 * https://github.com/SnakeskinTpl/snakeskin-loader
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/snakeskin-loader/blob/master/LICENSE
 */

- include './block'
- template [%fileName%](text) extends ['block']['block']
	- className = 'body'
