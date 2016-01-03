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
    canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower').setMode('instrument', Constants.BRUSH),
    brush: _.assign(Cursor(gameUserId + '-brush'), {
      size: Constants.BRUSH_WIDTH_INIT,
      opacity: Constants.BRUSH_OPACITY_INIT,
      color: Constants.BRUSH_COLOR_INIT
    }),
    cursor: Cursor(gameUserId + '-cursor'),
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
      var brush = _.cloneDeep(this.props.gameUser.brush)

      brush.size = ui.value

      gameUsersActions.assignItem(this.props.gameUser.id, {brush: brush})
    }.bind(this)
  })

  $('#brush-opacity').slider({
    min: Constants.BRUSH_OPACITY_MIN,
    max: Constants.BRUSH_OPACITY_MAX,
    value: Constants.BRUSH_OPACITY_INIT,
    step: Constants.BRUSH_OPACITY_STEP,
    slide: function(e, ui) {
      var brush = _.cloneDeep(this.props.gameUser.brush)

      brush.opacity = ui.value

      gameUsersActions.assignItem(this.props.gameUser.id, {brush: brush})
    }.bind(this)
  })

  $('#brush-color').minicolors({
    defaultValue: Constants.BRUSH_COLOR_INIT,
    change: function(color) {
      var brush = _.cloneDeep(this.props.gameUser.brush)

      brush.color = color

      gameUsersActions.assignItem(this.props.gameUser.id, {brush: brush})
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
  if (this.props.isMyGameUser && !this.props.gameUser.is_estimator && this.props.gameUser.canvas) {
    this.props.gameUser.canvas.setMode('size', this.props.gameUser.brush.size)
    this.props.gameUser.canvas.setMode('opacity', this.props.gameUser.brush.opacity / 100)
    this.props.gameUser.canvas.setMode('color', this.props.gameUser.brush.color)
  }

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
