import React, { PropTypes, Component } from 'react';
import { Form, Item, Input, Text } from 'native-base';
import withAuthentication from '../containers/withAuthentication';
import Container from './Container';
import Button from './Button';

const styles = {
  btn: {
    marginTop: 20,
  },
  form: {
    width: 300,
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
    };
  }

  render() {
    return (
      <Container>
        <Form style={styles.form}>
          <Item>
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
            style={{ marginTop: 20, textAlign: 'center', color: 'blue' }}
            onPress={this.props.toggleNewUser}
          >
            Sign In
          </Text>
        </Form>
      </Container>
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
