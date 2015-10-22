React = require 'react'

Template = require './layout.tpl.cjsx'

componentDidMount = ->
  console.log(33233)

Layout = React.createClass
  componentDidMount: componentDidMount
  render: -> Template.apply(@)

module.exports = Layout
