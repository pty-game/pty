import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import { View } from 'react-native';
import withGameApplication from '../containers/withGameApplication';
import Container from './Container';
import Button from './Button';
import withMenu from './withMenu';
import {blueColor} from "../constants/colors";

const styles = {
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    color: 'white',
  },
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
  btnContainer: {
    width: '100%',
  },
  btn: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  borderedBtn: {
    color: blueColor,
  }
};

const Home = ({ gameApplicationCreate, navigation }) => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>DanceMe.IO</Text>
        <View style={styles.btnContainer}>
          <Button
            block
            dark
            large
            onPress={() => {
              gameApplicationCreate({ isEstimator: false });
              navigation.navigate('Pending');
            }}
          >
            <Text style={styles.btn}>
              Dance!
            </Text>
          </Button>
          <Button
            block
            info
            bordered
            onPress={() => {
              gameApplicationCreate({ isEstimator: true });
              navigation.navigate('Pending');
            }}
          >
            <Text style={styles.borderedBtn}>
              Estimate
            </Text>
          </Button>
        </View>
      </View>
    </Container>
  );
};

Home.propTypes = {
  gameApplicationCreate: PropTypes.func.isRequired,
};

export default withMenu(withGameApplication(Home));
