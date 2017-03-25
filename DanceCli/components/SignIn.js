import React, { PropTypes, Component } from 'react';
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

class SignIn extends Component {
  constructor() {
    super();

    this.state = {
      login: '',
      password: '',
    };
  }

  render() {
    return (
      <Container>
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
          <Button
            block
            onPress={() => {
              this.props.signIn({
                login: this.state.login,
                password: this.state.password,
              });
            }}
          >
            <Text>
              Sign In
            </Text>
          </Button>
          {
            this.props.signInError && <Text style={styles.errorMessage}>
              {this.props.signInError}
            </Text>
          }
          <Text
            style={{ marginTop: 20, textAlign: 'center', color: 'blue' }}
            onPress={this.props.toggleNewUser}
          >
            Sign Up
          </Text>
        </Form>
      </Container>
    );
  }
}

SignIn.defaultProps = {
  signInError: null,
};

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  signInError: PropTypes.string,
  toggleNewUser: PropTypes.func.isRequired,
};

export default withAuthentication(SignIn);
