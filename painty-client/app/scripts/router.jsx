import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory'

import Layout from './components/layout/layout.jsx'
import Home from './components/home/home.jsx'
import Game from './components/game/game.jsx'

var routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home}/>
    <Route path="game/:gameId" component={Game}/>
  </Route>
)

exports.start = function() {
  React.render(<Router>
    {routes}
  </Router>, document.getElementById('content'))
}