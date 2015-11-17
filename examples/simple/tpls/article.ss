- include './block'
- include './header'
- include './body'

- template [%fileName%](title, content) extends ['block']
	- className = 'article'
	- block body
		- call self['header'](title)
		- call self['body'](content)
