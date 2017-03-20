import React, { PropTypes } from 'react';
import { View } from 'react-native';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const Container = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        {children}
      </View>
    </View>
  );
};

Container.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Container;
