import React from 'react'
import Template from './layout.tpl.jsx'
import UserAPI from '../../api/userAPI'
import suspend from 'suspend'

function getInitialState() {
  return {
    user: null
  }
}

var componentDidMount = suspend.promise(function *() {
  UserAPI.on(function(result) {
    switch(result.data.message) {
      case 'levelUp': {
        this.setState({
          user: result.data.payload.user
        })

        alert('Level up ' + result.data.payload.user.level);
        break;
      }
      case 'data': {
        this.setState({
          user: result.data.payload.user
        })

        break;
      }
    }
  }.bind(this));

  if ($.cookie('userId')) {
    var user = yield UserAPI.subscribe();

    this.setState({
      user
    });
  }
  else
    console.log('userId is not defined')
});

function componentWillUnmount() {
  UserAPI.off()
  UserAPI.unsubscribe()
}

function render() {
  return Template.apply(this)
}

var Layout = React.createClass({
  componentDidMount,
  componentWillUnmount,
  getInitialState,
  render
})

module.exports = Layout