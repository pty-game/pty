import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import Container from './Container';
import {useSelector} from "react-redux";

const GameResult = ({ navigation }) => {
  const gameResult = useSelector(({ game }) => game.gameResult);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home')
    }, 3000);
  }, [gameResult]);

  return (
    <Container>
      <Text style={{ textAlign: 'center' }}>
        { gameResult ? 'Congrats! You won!' : 'Unfortunately, you loose :( Try again.'}
      </Text>
    </Container>
  );
};

GameResult.propTypes = {
  won: PropTypes.bool.isRequired,
};

export default GameResult;
