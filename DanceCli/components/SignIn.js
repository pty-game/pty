import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { Form, Item, Input, Button, Text } from 'native-base';
import withUserData from '../containers/withUserData';

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
};

const SignIn = ({ signIn }) => {
  return (
    <View style={styles.container}>
      <Form style={styles.form}>
        <Item>
          <Input placeholder="Username" />
        </Item>
        <Item last>
          <Input placeholder="Password" />
        </Item>
        <Button
          style={styles.btn}
          block
          onPress={() => {
            signIn({ login: 'user1', password: '123456' });
          }}
        >
          <Text>
            Sign In
          </Text>
        </Button>
      </Form>
    </View>
  );
};

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
};

export default withUserData(SignIn);
