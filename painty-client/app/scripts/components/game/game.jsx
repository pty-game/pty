import React from 'react'
import Canvas from '../../api/canvasAPI'
import Cursor from '../../api/cursorAPI'
import Mouse from '../../api/mouseAPI'
import GameAPI from '../../api/gameAPI.js'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './game.tpl.jsx'

function getInitialState() {
  return {
    brush: {}
  }
}

function componentDidMount() {
  _initMyCanvas.apply(this)
  _initOpponentCanvas.apply(this)

  this.setState(function(prev) {
    prev.brush.size = Constants.BRUSH_WIDTH_INIT;
    prev.brush.opacity = Constants.BRUSH_OPACITY_INIT;
    prev.brush.color = Constants.BRUSH_COLOR_INIT;
  })
}

function componentWillUnmount() {
  _offOpponentCanvas.apply(this)
}

function render() {
  if (this.my) {
    this.my.canvas.setMode('size', this.state.brush.size)
    this.my.canvas.setMode('opacity', this.state.brush.opacity / 100)
    this.my.canvas.setMode('color', this.state.brush.color)
  }
  return Template.apply(this)
}

//============================================================

function toggleDrawingMode(mode) {
  this.my.canvas.setDrawingMode(mode)
}

function undo() {
  return this.my.canvas.undo()
}

function redo() {
  return this.my.canvas.redo()
}

//============================================================

function _initMyCanvas() {
  this.my = {
    canvas: Canvas('my-upper', 'my-lower').setMode('instrument', Constants.BRUSH),
    brush: Cursor('my-brush'),
    cursor: Cursor('my-cursor'),
    paintyArea: Mouse('.my.canvas-wrapper .painty-area')
  }

  this.opponent = {
    canvas: Canvas('opponent-upper', 'opponent-lower', false),
    brush: Cursor('opponent-brush')
  }

  this.my.paintyArea.onMouse('down', function(coords) {
    this.my.canvas.startDraw(coords)
  }.bind(this))

  this.my.paintyArea.onMouse('move', function(coords) {
    this.my.cursor.setPosition(coords.x, coords.y)
    this.my.brush.setPosition(coords.x, coords.y)
    this.my.canvas.drawing(coords)
  }.bind(this))

  this.my.paintyArea.onMouse('up', function() {
    this.my.canvas.stopDraw()
  }.bind(this))

  this.my.paintyArea.onMouse('over', function() {
    this.my.brush.show()
    this.my.cursor.show()
  }.bind(this))

  this.my.paintyArea.onMouse('out', function() {
    this.my.brush.hide()
    this.my.cursor.hide()
  }.bind(this))

  this.my.canvas.onChange(function(action) {
    GameAPI.addAction(this.props.params.gameId, action)
  }.bind(this))

  $('#brush-width').slider({
    min: Constants.BRUSH_WIDTH_MIN,
    max: Constants.BRUSH_WIDTH_MAX,
    value: Constants.BRUSH_WIDTH_INIT,
    step: Constants.BRUSH_WIDTH_STEP,
    slide: function(e, ui) {
      this.setState(function(prev) {
        prev.brush.size = ui.value;
      })
    }.bind(this)
  })

  $('#brush-opacity').slider({
    min: Constants.BRUSH_OPACITY_MIN,
    max: Constants.BRUSH_OPACITY_MAX,
    value: Constants.BRUSH_OPACITY_INIT,
    step: Constants.BRUSH_OPACITY_STEP,
    slide: function(e, ui) {
      this.setState(function(prev) {
        prev.brush.opacity = ui.value;
      })
    }.bind(this)
  })

  $('#brush-color').minicolors({
    defaultValue: Constants.BRUSH_COLOR_INIT,
    change: function(color) {
      this.setState(function(prev) {
        prev.brush.color = color;
      })
    }.bind(this)
  })
}

function _initOpponentCanvas() {
  GameAPI
    .on(function(result) {
      var action = result.data

      var options = {
        pathRendered: function(path) {
          this.opponent.brush.setPosition(path.x, path.y)
        }.bind(this),
        before: function(action) {
          if (action.instrument === 'undo' || action.instrument === 'redo') {
            return;
          }

          var defer = Q.defer()
          var path = action.coordsArr[0];

          this.opponent.brush.animate({
            left: path.x,
            top: path.y
          }, function() {
            defer.resolve()
          })

          return defer.promise
        }.bind(this)
      }

      this.opponent.canvas.makeAction(action, options)
    }.bind(this))
}

function _offOpponentCanvas() {
  GameAPI.off()
  GameAPI.unsubscribe(this.props.params.gameId)
}
//============================================================

module.exports = React.createClass({
  undo,
  redo,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
  toggleDrawingMode,
  render
})