import React from 'react'
import Template from './home.tpl.jsx'

function render() {
  return Template.apply(this);
}

var Home = React.createClass({
  render: render
});

module.exports = Home;