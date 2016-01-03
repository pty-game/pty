import React from 'react'
import Reflux from 'reflux'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './tools.tpl.jsx'
import History from 'react-router/lib/History.js'
import GameAPI from '../../api/gameAPI.js'

function toggleDrawingMode(mode) {
  var myGameUser = _.find(this.state.gameUsers, {user: parseInt(window.userId)})
  myGameUser.canvas.setDrawingMode(mode)
}

function undo() {
  var myGameUser = _.find(this.props.gameUsers, {user: parseInt(window.userId)})
  myGameUser.canvas.undo()
}

function redo() {
  var myGameUser = _.find(this.props.gameUsers, {user: parseInt(window.userId)})
  myGameUser.canvas.redo()
}

function voteFor(playerId) {
  var action = {
    instrument: 'estimate',
    playerId: playerId
  }

  GameAPI.addAction(this.props.params.gameId, action)
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
}

function componentWillUnmount() {
}

//====================================================

module.exports = React.createClass({
  mixins: [History],
  render,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
  toggleDrawingMode,
  undo,
  redo,
  voteFor,
});
