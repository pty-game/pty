var Home, React, Template;
React = require('react');
Template = require('./home.tpl.jsx');
Home = React.createClass({
  render: function() {
    return Template.apply(this);
  }
});
module.exports = Home;