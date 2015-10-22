Constants = require '../constants/constants'



module.exports = (id, autoMove = true)-> 
	cursor = $('#' + id)
	
	show = ->
		cursor.animate {opacity: 1}, 200

	hide = ->
		cursor.animate {opacity: 0}, 200

	setPosition = (x, y)->
		cursor.css 'left', x
		cursor.css 'top', y
	
	obj =
		setPosition: setPosition
		hide: hide
		show: show

	cursor extends obj