import React, { PropTypes } from 'react';
import {
 View,
} from 'react-native';
import { Text } from 'native-base';
import withGameApplication from '../containers/withGameApplication';
import Container from './Container';
import Button from './Button';

const styles = {
  btn: {
    marginTop: 20,
  },
};

const Home = ({ gameApplicationCreate }) => {
  return (
    <Container>
      <View>
        <Button
          style={styles.btn}
          block
          onPress={() => { gameApplicationCreate({ isEstimator: false }); }}
        >
          <Text>
            Start dancing
          </Text>
        </Button>
        <Button
          style={styles.btn}
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

export default withGameApplication(Home);
