import React, { PropTypes } from 'react';
import { Text } from 'react-native';
import Container from './Container';

const Error = ({ text }) => {
  return (
    <Container>
      <Text style={{ textAlign: 'center' }}>
        {text}
      </Text>
    </Container>
  );
};

Error.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Error;
