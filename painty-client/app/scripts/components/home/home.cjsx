React = require 'react'
Template = require './home.tpl.cjsx'

Home = React.createClass

  render: -> Template.apply(@)

module.exports = Home
