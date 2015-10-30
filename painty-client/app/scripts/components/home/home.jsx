import React from 'react'
import Template from './home.tpl.jsx'
import GameApplicationAPI from '../../api/gameApplicationAPI.js'
import GameAPI from '../../api/gameAPI.js'
import suspend from 'suspend'
import History from 'react-router/lib/History.js'

var Home = React.createClass({
  mixins: [History],
  render,
  getInitialState,
  componentDidMount: suspend(componentDidMount),
  createGameApplication
});

module.exports = Home;

function render() {
  return Template.apply(this);
}

function getInitialState() {
  return {}
}

function *componentDidMount() {
  var gameApplicationResult = yield GameApplicationAPI.on()
  var game = yield GameAPI.subscribe(gameApplicationResult.data.gameId)
  console.log(game)
  this.history.pushState(null, '/game/' + game.id)
}

//==========================

function createGameApplication() {
  window.userId = this.refs.userId.getValue()

  GameApplicationAPI.create(this.refs.userId.getValue())
}