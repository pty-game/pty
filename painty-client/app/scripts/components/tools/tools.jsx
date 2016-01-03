import React from 'react'
import Reflux from 'reflux'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './tools.tpl.jsx'


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
  mixins: [],
  render,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
});
