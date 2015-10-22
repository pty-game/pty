React = require 'react'
Router = require 'react-router'
RouteHandler = Router.RouteHandler

Layout = React.createClass

module.exports = ->
  <div className="App">
    <RouteHandler />
  </div>
