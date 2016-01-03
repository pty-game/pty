import React from 'react'
import Reflux from 'reflux'
import Canvas from '../../api/canvasAPI'
import Cursor from '../../api/cursorAPI'
import Mouse from '../../api/mouseAPI'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './tools.tpl.jsx'
import gameHandlers from '../../utils/gameHandlers.js'
import gameUsersStore from '../../stores/gameUsers.js'

function _initMy(gameUserId) {
  this.setState(function(prev) {
      prev.canvas = Canvas(gameUserId + '-upper', gameUserId + '-lower').setMode('instrument', Constants.BRUSH)
      prev.brush = Cursor(gameUserId + '-brush')
      prev.cursor = Cursor(gameUserId + '-cursor')
      prev.paintyArea = Mouse('.' + gameUserId + '.canvas-wrapper .painty-area')
  })

  this.state.paintyArea.onMouse('down', function(coords) {
    this.state.canvas.startDraw(coords)
  }.bind(this))

  this.state.paintyArea.onMouse('move', function(coords) {
    this.state.cursor.setPosition(coords.x, coords.y)
    this.state.brush.setPosition(coords.x, coords.y)
    this.state.canvas.drawing(coords)
  }.bind(this))

  this.state.paintyArea.onMouse('up', function() {
    this.state.canvas.stopDraw()
  }.bind(this))

  this.state.paintyArea.onMouse('over', function() {
    this.state.brush.show()
    this.state.cursor.show()
  }.bind(this))

  this.state.paintyArea.onMouse('out', function() {
    this.state.brush.hide()
    this.state.cursor.hide()
  }.bind(this))

  this.state.canvas.onChange(function(action) {
    GameAPI.addAction(this.props.params.gameId, action)
  }.bind(this))

  /*
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
  */

  this.setState(function(prev) {
    prev.brush.size = Constants.BRUSH_WIDTH_INIT;
    prev.brush.opacity = Constants.BRUSH_OPACITY_INIT;
    prev.brush.color = Constants.BRUSH_COLOR_INIT;
  })
}

function _initOpponent(gameUserId) {
  this.setState(function(prev) {
    prev.canvas = Canvas(gameUserId + '-upper', gameUserId + '-lower', false)
    prev.brush = Cursor(gameUserId + '-brush')
  })
}

function _makeInitActions(gameActions) {
  gameActions.forEach(function(gameAction) {
    if (gameAction.gameUser != this.props.gameUser.id)
      return

    var action = gameAction.action

    var options = {
      initAction: true
    }

    this.state.canvas.makeAction(action, options)
  }.bind(this))
}

//====================================================

function render() {
  if (this.props.myGameUser &&!this.props.gameUser.is_estimator) {
    this.state.canvas.setMode('size', this.state.brush.size)
    this.state.canvas.setMode('opacity', this.state.brush.opacity / 100)
    this.state.canvas.setMode('color', this.state.brush.color)
  }

  return Template.apply(this);
}

function getInitialState() {
  var obj = {}

  if (this.props.myGameUser)
    obj.brush = {}

  return obj
}

function componentDidMount() {
  if (this.props.myGameUser)
    _initMy.call(this, this.props.gameUser.id)
  else
    _initOpponent.call(this, this.props.gameUser.id)

  _makeInitActions(this.props.gameUsersActions)
}

function componentWillUnmount() {
}

//====================================================

module.exports = React.createClass({
  mixins: [],
  render,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
});
