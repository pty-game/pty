var React = require('react')
var Router = require('react-router')
var Route = Router.Route
var Routes = Router.Routes
var DefaultRoute = Router.DefaultRoute

var Layout = require('./components/layout/layout')
var Home = require('./components/home/home')
var Game = require('./components/game/game')

var routes = (
	<Route name="layout" path="/" handler={Layout}>
		<DefaultRoute handler={Home} />
		<Route name="game" path="/game" handler={Game} />
	</Route>
)

exports.start = function() {
	Router.run(routes, function(Handler) {
		return React.render(<Handler/>, document.getElementById('content'))
	})
}