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

const styles = {
    text: {
        backgroundColor: 'transparent',
        color: 'white',
        textAlign: 'center',
    },
    camera: {
        flex: 1,
        position: 'relative',
        padding: 20,
    },
    cameraView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    btn: {
        fontSize: 25
    }
};

const Home = ({ gameApplicationCreate }) => {
  return (
    <Container>
        <Button
          block
        large
          onPress={() => { gameApplicationCreate({ isEstimator: false }); }}
        >
          <Text style={styles.btn}>
            Start dancing
          </Text>
        </Button>
        <Button
          block
        large
          onPress={() => { gameApplicationCreate({ isEstimator: true }); }}
        >
          <Text style={styles.btn}>
            Start estimation
          </Text>
        </Button>
    </Container>
  );
};

Home.propTypes = {
  gameApplicationCreate: PropTypes.func.isRequired,
};

export default withMenu(withGameApplication(Home));
