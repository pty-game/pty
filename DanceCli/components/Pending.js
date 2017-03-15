import React from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
};

const Pending = () => {
  return (<View style={styles.container}>
    <Spinner />
  </View>);
};

export default Pending;
