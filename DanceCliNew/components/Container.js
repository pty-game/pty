import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

export const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const Container = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

Container.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Container;
