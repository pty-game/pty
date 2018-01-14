import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import withAuthentication from '../containers/withAuthentication';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

class Authentication extends Component {
  constructor() {
    super();

    this.state = {
      isNewUser: false,
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      this.props.subscribe(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token && !this.props.token) {
      this.props.subscribe(nextProps.token);
    }

    if (nextProps.userData && !this.props.userData) {
      if (this.state.isNewUser) {
        Actions.signUpSuccess();

        setTimeout(() => {
          Actions.home();
        }, 2000);
      } else {
        Actions.home();
      }
    }
  }

  toggleNewUser(isNewUser = !this.state.isNewUser) {
    this.setState({ isNewUser });
  }

  render() {
    return this.state.isNewUser ?
      <SignUp toggleNewUser={() => { this.toggleNewUser(); }} /> :
      <SignIn toggleNewUser={() => { this.toggleNewUser(); }} />;
  }
}

Authentication.defaultProps = {
  userData: null,
  token: null,
};

Authentication.propTypes = {
  subscribe: PropTypes.func.isRequired,
  token: PropTypes.string,
  userData: PropTypes.object,
};

export default withAuthentication(Authentication);
