import React from 'react'
import Template from './home.tpl.jsx'
import GameApplicationAPI from '../../api/gameApplicationAPI.js'
import History from 'react-router/lib/History.js'

function render() {
  return Template.call(this);
}

function getInitialState() {
  return {}
}

function componentDidMount() {
  GameApplicationAPI
    .on(function(result) {
      switch(result.data.message) {
        case 'gameFound': {
          this.history.pushState(null, '/game/' + result.data.payload.gameId);
          break;
        }
        case 'gameApplicationExpired': {
          alert('Game application expired');
          break;
        }
      }
    }.bind(this))
}

function componentWillUnmount() {
  GameApplicationAPI.off()
}

//====================================================

function createGameApplication() {
  $.cookie('userId', this.refs.userId.getValue())

  GameApplicationAPI.create({
    is_estimator: this.refs.isEstimator.getChecked()
  })
}

//====================================================

var obj = {
  mixins: [History],
  render,
  componentDidMount,
  componentWillUnmount,
  createGameApplication,
}

module.exports = React.createClass(obj);