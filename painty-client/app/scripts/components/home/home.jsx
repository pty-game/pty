import React from 'react'
import Template from './home.tpl.jsx'
import GameApplicationAPI from '../../api/gameApplicationAPI.js'

var Home = React.createClass({
  render: render,
  getInitialState: getInitialState,

  createGameApplication: createGameApplication
});

module.exports = Home;

function render() {
  return Template.apply(this);
}

function getInitialState() {
  return {}
}

function createGameApplication() {
  GameApplicationAPI.create(this.refs.userId.getValue())
  GameApplicationAPI.on(function() {
    console.log(arguments)
  })
}


