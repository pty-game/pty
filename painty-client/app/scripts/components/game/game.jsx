import React from 'react'
import Reflux from 'reflux'
import Canvas from '../../api/canvasAPI'
import Cursor from '../../api/cursorAPI'
import Mouse from '../../api/mouseAPI'
import GameAPI from '../../api/gameAPI.js'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './game.tpl.jsx'
import History from 'react-router/lib/History.js'
import gameHandlers from '../../utils/gameHandlers.js'
import gameUsersStore from '../../stores/gameUsers.js'
import gameUsersActions from '../../actions/gameUsers.js'
import gameUsersActionsStore from '../../stores/gameUsersActions'
import gameUsersActionsActions from '../../actions/gameUsersActions'


//============================================================


function toggleDrawingMode(mode) {
  this.state.gameUsers[this.state.myGameUser.id].canvas.setDrawingMode(mode)
}

function undo() {
  return this.state.gameUsers[this.state.myGameUser.id].canvas.undo()
}

function redo() {
  return this.state.gameUsers[this.state.myGameUser.id].canvas.redo()
}

function voteFor(playerId) {
  var action = {
    instrument: 'estimate',
    playerId: playerId
  }

  GameAPI.addAction(this.props.params.gameId, action)
}


//============================================================


var _getGame = suspend.promise(function *() {
  var game = yield GameAPI.subscribe(this.props.params.gameId)

  return game
})

function _initGame(game) {
  gameUsersActions.addItems(game.game_users)
  gameUsersActionsActions.addItems(game.game_actions)
}

function _onOpponentCanvas() {
  GameAPI.on(function(result) {
    gameHandlers[result.data.message].call(this, result)
  }.bind(this))
}

function _offOpponentCanvas() {
  GameAPI.off()
  GameAPI.unsubscribe(this.props.params.gameId)
}


//============================================================


function getInitialState() {
  return {
    gameUsers: gameUsersStore.list,
    gameUsersActions: gameUsersActionsStore.list,
  }
}

var componentDidMount = suspend(function *() {
  var game = yield _getGame.call(this)

  _initGame(game)
  _onOpponentCanvas()
})

function componentWillUnmount() {
  _offOpponentCanvas()
}

function render() {
  return Template.call(this)
}


//============================================================


module.exports = React.createClass({
  mixins: [
    History,
    Reflux.connect(gameUsersStore, 'gameUsers'),
    Reflux.connect(gameUsersActionsStore, 'gameUsersActions'),
  ],
  undo,
  redo,
  voteFor,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
  toggleDrawingMode,
  render
})