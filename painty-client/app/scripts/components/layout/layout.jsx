var Layout, React, Template, componentDidMount;
React = require('react');
Template = require('./layout.tpl.jsx');

componentDidMount = function() {
  return console.log(11);
};

Layout = React.createClass({
  componentDidMount: componentDidMount,
  render: function() {
    return Template.apply(this);
  }
});
module.exports = Layout;