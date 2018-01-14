import React from 'react';
import PropTypes from 'prop-types';
import {
 View,
} from 'react-native';
import { Text } from 'native-base';
import withGameApplication from '../containers/withGameApplication';
import Container from './Container';
import Button from './Button';
import withMenu from './withMenu';

const Home = ({ gameApplicationCreate }) => {
  return (
    <Container>
      <View>
        <Button
          block
          onPress={() => { gameApplicationCreate({ isEstimator: false }); }}
        >
          <Text>
            Start dancing
          </Text>
        </Button>
        <Button
          block
          onPress={() => { gameApplicationCreate({ isEstimator: true }); }}
        >
          <Text>
            Start estimation
          </Text>
        </Button>
      </View>
    </Container>
  );
};

Home.propTypes = {
  gameApplicationCreate: PropTypes.func.isRequired,
};

export default withMenu(withGameApplication(Home));
