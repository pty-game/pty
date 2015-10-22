var Layout, React, RouteHandler, Router;
React = require('react');
Router = require('react-router');
RouteHandler = Router.RouteHandler;
Layout = React.createClass;

module.exports = function() {
  return <div className="App">
    <RouteHandler />
  </div>
};
