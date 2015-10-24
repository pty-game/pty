import React from 'react'
import Router from 'react-router'

module.exports = function() {
  return <div className="app">
    {this.props.children}
  </div>
};
