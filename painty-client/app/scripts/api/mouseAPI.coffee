Constants = require '../constants/constants'

_getCoords = (e)->
	offset = @offset()
	
	return { 
		x: e.clientX - offset.left + $(document).scrollLeft()
		y: e.clientY - offset.top + $(document).scrollTop()
	}

onMouse = (event, callback)->
	target = if event == 'down' || event == 'over' || event == 'out' then @ else $(document)

	target['mouse' + event] ((e)->
		if event == 'down' && e.which != 1
			return
			
		callback @_getCoords(e)
	).bind(@)

	@

module.exports = (id)-> 
	paintyArea = $(id)
	
	obj =
		_getCoords: _getCoords
		onMouse: onMouse

	paintyArea extends obj