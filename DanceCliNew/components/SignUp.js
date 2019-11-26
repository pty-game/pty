import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Form, Item, Input, Text } from 'native-base';
import withAuthentication from '../containers/withAuthentication';
import Container from './Container';
import Button from './Button';

const styles = {
  btn: {
    marginTop: 20,
  },
  errorMessage: {
    marginTop: 20,
    textAlign: 'center',
  },
};

class SignUp extends Component {
  constructor() {
    super();

    this.state = {
      login: '',
      password: '',
      repeatPassword: '',
    };
  }

  render() {
    return (
      <Form>
        <Item last>
          <Input
            placeholder="Username"
            onChangeText={(login) => { this.setState({ login }); }}
            value={this.state.login}
          />
        </Item>
        <Item last>
          <Input
            placeholder="Password"
            secureTextEntry
            onChangeText={(password) => { this.setState({ password }); }}
            value={this.state.password}
          />
        </Item>
        <Item last>
          <Input
            placeholder="Repeat password"
            secureTextEntry
            onChangeText={(password) => { this.setState({ repeatPassword: password }); }}
            value={this.state.repeatPassword}
          />
        </Item>
        <Button
          block
          onPress={() => {
            this.props.signUp({
              login: this.state.login,
              password: this.state.password,
            });
          }}
        >
          <Text>
            Sign Up
          </Text>
        </Button>
        {
          this.props.signUpError && <Text style={styles.errorMessage}>
            {this.props.signUpError}
          </Text>
        }
        <Text
          style={{ marginTop: 20, textAlign: 'center' }}
          onPress={this.props.toggleNewUser}
        >
          Sign In
        </Text>
      </Form>
    );
  }
}

SignUp.defaultProps = {
  signUpError: null,
};

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired,
  signUpError: PropTypes.string,
  toggleNewUser: PropTypes.func.isRequired,
};

export default withAuthentication(SignUp);
