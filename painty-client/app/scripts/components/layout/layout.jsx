import React from 'react'
import Template from './layout.tpl.jsx'

function componentDidMount() {
}

function render() {
  return Template.apply(this)
}

var Layout = React.createClass({
  componentDidMount: componentDidMount,
  render: render
})

module.exports = Layout