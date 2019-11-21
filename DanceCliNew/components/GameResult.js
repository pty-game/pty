import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import Container from './Container';

const GameResult = ({ won }) => {
  return (
    <Container>
      <Text style={{ textAlign: 'center' }}>
        { won ? 'Congrats! You won!' : 'Unfortunately, you loose :( Try again.'}
      </Text>
    </Container>
  );
};

GameResult.propTypes = {
  won: PropTypes.bool.isRequired,
};

export default GameResult;
