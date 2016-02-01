import React from 'react'
import Reflux from 'reflux'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './tools.tpl.jsx'
import History from 'react-router/lib/History.js'
import gameUsersActionsActions from '../../actions/gameUsersActions.js'

function render() {
  return Template.apply(this);
}

function getInitialState() {
  var obj = {}

  return obj
}

function componentDidMount() {
  if (!this.props.myGameUser.is_estimator)
    this._initMyTools()
}

function componentWillUnmount() {
}

//====================================================

function toggleDrawingMode(mode) {
  var myGameUser = _.find(this.state.gameUsers, {user: parseInt($.cookie('userId'))})
  myGameUser.canvas.setDrawingMode(mode)
}

function undo() {
  var myGameUser = _.find(this.props.gameUsers, {user: parseInt($.cookie('userId'))})
  myGameUser.canvas.undo()
}

function redo() {
  var myGameUser = _.find(this.props.gameUsers, {user: parseInt($.cookie('userId'))})
  myGameUser.canvas.redo()
}

function voteFor(gameUserId) {
  var action = {
    instrument: 'estimate',
    gameUserId: gameUserId
  }

  gameUsersActionsActions.addAction(this.props.params.gameId, action)
}

//====================================================

function _initMyTools() {
  $('#brush-width').slider({
    min: Constants.BRUSH_WIDTH_MIN,
    max: Constants.BRUSH_WIDTH_MAX,
    value: Constants.BRUSH_WIDTH_INIT,
    step: Constants.BRUSH_WIDTH_STEP,
    slide: function(e, ui) {
      this.props.myGameUser.canvas.setMode('size', ui.value)
      this.props.myGameUser.cursor.setSize(ui.value)
    }.bind(this)
  })

  $('#brush-opacity').slider({
    min: Constants.BRUSH_OPACITY_MIN,
    max: Constants.BRUSH_OPACITY_MAX,
    value: Constants.BRUSH_OPACITY_INIT,
    step: Constants.BRUSH_OPACITY_STEP,
    slide: function(e, ui) {
      this.props.myGameUser.canvas.setMode('opacity',  ui.value / 100)
    }.bind(this)
  })

  $('#brush-color').minicolors({
    defaultValue: Constants.BRUSH_COLOR_INIT,
    change: function(color) {
      this.props.myGameUser.canvas.setMode('color', color)
    }.bind(this)
  })
}

//====================================================

var obj = {
  mixins: [History],
  render,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
  toggleDrawingMode,
  undo,
  redo,
  voteFor,
  _initMyTools
}

module.exports = React.createClass(obj)