mouseEvent = (event) ->
	  evt = undefined
	  e = 
	    bubbles: true
	    cancelable: event.type != 'mousemove'
	    view: window
	    detail: 0
	    screenX: event.screenX
	    screenY: event.screenY
	    clientX: event.clientX
	    clientY: event.clientY
	    ctrlKey: false
	    altKey: false
	    shiftKey: false
	    metaKey: false
	    button: 0
	    relatedTarget: undefined

	  if typeof document.createEvent == 'function'
	    evt = document.createEvent('MouseEvents')
	    evt.initMouseEvent event.type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode
	  else if document.createEventObject
	    evt = document.createEventObject()
	    for prop of e
	      `prop = prop`
	      evt[prop] = e[prop]
	      
	    evt.button = {
	      0: 1
	      1: 4
	      2: 2
	    }[evt.button] or evt.button

	  evt

dispatchEvent = (el, evt) ->
  if el.dispatchEvent
    el.dispatchEvent evt
  else if el.fireEvent
    el.fireEvent 'on' + type, evt
  evt

module.exports = (elem, event)->
	dispatchEvent elem, mouseEvent(event)
