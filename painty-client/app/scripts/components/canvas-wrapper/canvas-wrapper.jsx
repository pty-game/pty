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
import gameHandlers from '../../utils/gameHandlers.js'
import gameUsersActions from '../../actions/gameUsers'

function _initMy(gameUserId) {
  gameUsersActions.assignItem(gameUserId, {
    canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower').setMode('instrument', Constants.BRUSH),
    brush: Cursor(gameUserId + '-brush'),
    cursor: Cursor(gameUserId + '-cursor'),
    paintyArea: Mouse('.' + gameUserId + '.canvas-wrapper .painty-area')
  })

  this.props.gameUser.paintyArea.onMouse('down', function(coords) {
    this.props.gameUser.canvas.startDraw(coords)
  }.bind(this))

  this.props.gameUser.paintyArea.onMouse('move', function(coords) {
    this.props.gameUser.cursor.setPosition(coords.x, coords.y)
    this.props.gameUser.brush.setPosition(coords.x, coords.y)
    this.props.gameUser.canvas.drawing(coords)
  }.bind(this))

  this.props.gameUser.paintyArea.onMouse('up', function() {
    this.props.gameUser.canvas.stopDraw()
  }.bind(this))

  this.props.gameUser.paintyArea.onMouse('over', function() {
    this.props.gameUser.brush.show()
    this.props.gameUser.cursor.show()
  }.bind(this))

  this.props.gameUser.paintyArea.onMouse('out', function() {
    this.props.gameUser.brush.hide()
    this.props.gameUser.cursor.hide()
  }.bind(this))

  this.props.gameUser.canvas.onChange(function(action) {
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
  gameUsersActions.assignItem(gameUserId, {
    canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower', false),
    brush: Cursor(gameUserId + '-brush')
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
    this.props.gameUser.canvas.setMode('size', this.props.gameUser.brush.size)
    this.props.gameUser.canvas.setMode('opacity', this.props.gameUser.brush.opacity / 100)
    this.props.gameUser.canvas.setMode('color', this.props.gameUser.brush.color)
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
