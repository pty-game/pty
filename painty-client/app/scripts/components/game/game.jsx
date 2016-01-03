import React from 'react'
import Reflux from 'reflux'
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

  gameUsersActions.removeAll()
  gameUsersActionsActions.removeAll()
}


//============================================================


function getInitialState() {
  return {}
}

var componentDidMount = suspend(function *() {
  var game = yield _getGame.call(this)

  _initGame(game)
  _onOpponentCanvas.call(this)
})

function componentWillUnmount() {
  _offOpponentCanvas.call(this)
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
  getInitialState,
  componentDidMount,
  componentWillUnmount,
  render
})