- template [%fileName%](text)
	- tagName = 'div'
	- className = ''
	- block root
		< ${tagName}.${className}
			- block body
				{text}
