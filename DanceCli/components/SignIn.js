import React, { PropTypes, Component } from 'react';
import { View } from 'react-native';
import { Form, Item, Input, Button, Text } from 'native-base';
import withAuthentication from '../containers/withAuthentication';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  btn: {
    marginTop: 20,
  },
  form: {
    width: 300,
  },
  errorMessage: {
    marginTop: 20,
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
      <View style={styles.container}>
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
            style={styles.btn}
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
            this.props.error && <Text style={styles.errorMessage}>
              {this.props.error}
            </Text>
          }
        </Form>
      </View>
    );
  }
}

SignIn.defaultProps = {
  error: null,
};

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default withAuthentication(SignIn);
