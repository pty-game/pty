import React, { PropTypes, Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import withAuthentication from '../containers/withAuthentication';
import SignIn from '../components/SignIn';

class Authentication extends Component {
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
      Actions.home();
    }
  }

  render() {
    return <SignIn />;
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
