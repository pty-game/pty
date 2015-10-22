React = require 'react'
Canvas = require '../../api/canvasAPI'
Cursor = require '../../api/cursorAPI'
Mouse = require '../../api/mouseAPI'
Constants = require '../../constants/constants'
vow = require 'vow'

Template = require './game.tpl.cjsx'

undo = ->
	@my.canvas.undo()

redo = ->
	@my.canvas.redo()

getInitialState = ->
  brush: {}

componentDidMount = ->
	@my =
		canvas: Canvas('my-upper', 'my-lower').setMode('instrument', Constants.BRUSH)
		brush: Cursor('my-brush')
		cursor: Cursor('my-cursor')
		paintyArea: Mouse('.my.canvas-wrapper .painty-area')

	@opponent =
		canvas: Canvas('opponent-upper', 'opponent-lower', false)
		brush: Cursor('opponent-brush')

	@my.paintyArea
	.onMouse 'down', ((coords)->
		@my.canvas.startDraw coords
	).bind(@)

	.onMouse 'move', ((coords)->
		@my.cursor.setPosition(coords.x, coords.y)
		@my.brush.setPosition(coords.x, coords.y)

		@my.canvas.drawing coords
	).bind(@)

	.onMouse 'up', ((coords)->
		@my.canvas.stopDraw()
	).bind(@)

	.onMouse 'over', ((coords)->
		@my.brush.show()
		@my.cursor.show()
	).bind(@)

	.onMouse 'out', ((coords)->
		@my.brush.hide()
		@my.cursor.hide()
	).bind(@)

	@my.canvas.onChange ((action)->
    options =
      pathRendered: ((path)->
          @opponent.brush.setPosition path.x, path.y
        ).bind(@)

      before: ((action)->
          if action.instrument == 'undo' || action.instrument == 'redo' then return

          defer = vow.defer()
          path = action.coordsArr[0]

          @opponent.brush.animate
            left: path.x
            top: path.y
          , -> defer.resolve()

          defer.promise()
        ).bind(@)

    @opponent.canvas.makeAction action, options
	).bind(@)

	$('#brush-width').slider {
		min: Constants.BRUSH_WIDTH_MIN
		max: Constants.BRUSH_WIDTH_MAX
		value: Constants.BRUSH_WIDTH_INIT
		step: Constants.BRUSH_WIDTH_STEP
		slide: ((e, ui)->
			@setState (prev)-> prev.brush.size = ui.value
		).bind(@)
	}

	$('#brush-opacity').slider {
		min: Constants.BRUSH_OPACITY_MIN
		max: Constants.BRUSH_OPACITY_MAX
		value: Constants.BRUSH_OPACITY_INIT
		step: Constants.BRUSH_OPACITY_STEP
		slide: ((e, ui)->
			@setState (prev)-> prev.brush.opacity = ui.value
		).bind(@)
	}

	$('#brush-color').minicolors({
		defaultValue: Constants.BRUSH_COLOR_INIT
		change: ((color)->
	        @setState (prev)-> prev.brush.color = color
	    ).bind(@)
	})

	@setState (prev)->
		prev.brush.size = Constants.BRUSH_WIDTH_INIT
		prev.brush.opacity = Constants.BRUSH_OPACITY_INIT
		prev.brush.color = Constants.BRUSH_COLOR_INIT

toggleDrawingMode = (mode)->
	@my.canvas.setDrawingMode(mode)

render = ->
  if @my
    @my.canvas.setMode('size', @state.brush.size)
    @my.canvas.setMode('opacity', @state.brush.opacity / 100)
    @my.canvas.setMode('color', @state.brush.color)

  return Template.apply(@)

module.exports = React.createClass
	undo: undo
	redo: redo
	getInitialState: getInitialState
	componentDidMount: componentDidMount
	toggleDrawingMode: toggleDrawingMode
	render: render
