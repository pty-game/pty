import React from 'react'
import Reflux from 'reflux'
import Canvas from '../../api/canvasAPI'
import Cursor from '../../api/cursorAPI'
import Mouse from '../../api/mouseAPI'
import GameAPI from '../../api/gameAPI.js'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './canvas-wrapper.tpl.jsx'
import gameUsersActions from '../../actions/gameUsers'

function _initMy(gameUserId) {
  var obj = {
    canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower')
      .setMode('instrument', Constants.BRUSH)
      .setMode('size', Constants.BRUSH_WIDTH_INIT)
      .setMode('color', Constants.BRUSH_COLOR_INIT)
      .setMode('opacity', Constants.BRUSH_OPACITY_INIT),
    brush: Cursor(gameUserId + '-brush'),
    cursor: Cursor(gameUserId + '-cursor')
      .setSize(Constants.BRUSH_WIDTH_INIT),
    paintyArea: Mouse('.' + gameUserId + '.canvas-wrapper .painty-area')
  }

  obj.paintyArea.onMouse('down', function(coords) {
    obj.canvas.startDraw(coords)
  }.bind(this))

  obj.paintyArea.onMouse('move', function(coords) {
    obj.cursor.setPosition(coords.x, coords.y)
    obj.brush.setPosition(coords.x, coords.y)
    obj.canvas.drawing(coords)
  }.bind(this))

  obj.paintyArea.onMouse('up', function() {
    obj.canvas.stopDraw()
  }.bind(this))

  obj.paintyArea.onMouse('over', function() {
    obj.brush.show()
    obj.cursor.show()
  }.bind(this))

  obj.paintyArea.onMouse('out', function() {
    obj.brush.hide()
    obj.cursor.hide()
  }.bind(this))

  obj.canvas.onChange(function(action) {
    GameAPI.addAction(this.props.gameUser.game, action)
  }.bind(this))

  gameUsersActions.assignItem(gameUserId, obj)
}

function _initMyTools() {
  $('#brush-width').slider({
    min: Constants.BRUSH_WIDTH_MIN,
    max: Constants.BRUSH_WIDTH_MAX,
    value: Constants.BRUSH_WIDTH_INIT,
    step: Constants.BRUSH_WIDTH_STEP,
    slide: function(e, ui) {
      this.props.gameUser.canvas.setMode('size', ui.value)
      this.props.gameUser.cursor.setSize(ui.value)
    }.bind(this)
  })

  $('#brush-opacity').slider({
    min: Constants.BRUSH_OPACITY_MIN,
    max: Constants.BRUSH_OPACITY_MAX,
    value: Constants.BRUSH_OPACITY_INIT,
    step: Constants.BRUSH_OPACITY_STEP,
    slide: function(e, ui) {
      this.props.gameUser.canvas.setMode('opacity',  ui.value / 100)
    }.bind(this)
  })

  $('#brush-color').minicolors({
    defaultValue: Constants.BRUSH_COLOR_INIT,
    change: function(color) {
      this.props.gameUser.canvas.setMode('color', color)
    }.bind(this)
  })
}

function _initOpponent(gameUserId) {
  gameUsersActions.assignItem(gameUserId, {
    canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower', false),
    brush: Cursor(gameUserId + '-brush')
  })
}

function _makeInitActions(gameActions) {
  gameActions.forEach(function(gameAction) {
    if (gameAction.game_user != this.props.gameUser.id)
      return

    var action = gameAction.action

    var options = {
      initAction: true
    }

    this.props.gameUser.canvas.makeAction(action, options)
  }.bind(this))
}

//====================================================

function render() {
  return Template.apply(this);
}

function getInitialState() {
  var obj = {}

  return obj
}

function componentDidMount() {
  if (this.props.isMyGameUser) {
    _initMy.call(this, this.props.gameUser.id)
    _initMyTools.call(this)
  }
  else
    _initOpponent.call(this, this.props.gameUser.id)

  //next tick(storage updated)
  setTimeout(_makeInitActions.bind(this, this.props.gameUsersActions))
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
