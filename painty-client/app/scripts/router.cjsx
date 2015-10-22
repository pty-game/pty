React = require 'react'
Router = require 'react-router'
Route = Router.Route
Routes = Router.Routes
DefaultRoute = Router.DefaultRoute

Layout = require './components/layout/layout'
Home = require './components/home/home'
Game = require './components/game/game'

routes = (
	<Route name="layout" path="/" handler={Layout}>
		<DefaultRoute handler={Home} />
		<Route name="game" path="/game" handler={Game} />
	</Route>
)

exports.start = ->
	Router.run routes, (Handler) ->
		React.render <Handler />, document.getElementById('content')
