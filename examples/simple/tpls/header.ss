- include './block' as placeholder

- template [%fileName%](text) extends ['block']
	- tagName = 'h1'
	- className = 'header'
	- block body
		< span
			Article:
		- super
