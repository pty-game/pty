import React from 'react';
import {
 Dimensions,
 View,
} from 'react-native';
import { Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  btn: {
    marginTop: 20,
  },
};

const Home = () => {
  return (<View style={styles.container}>
    <View>
      <Text>
        Welcome to React Native!
      </Text>
      <Text>
        To get started, edit index.ios.js
      </Text>
      <Text >
        Press Cmd+R to reload,{'\n'}
        Cmd+D or shake for dev menu
      </Text>
      <Button style={styles.btn} block onPress={() => { Actions.capture(); }}>
        <Text>
          Start dancing
        </Text>
      </Button>
      <Button style={styles.btn} block onPress={() => { Actions.estimation(); }}>
        <Text>
          Start estimation
        </Text>
      </Button>
    </View>
  </View>);
};

export default Home;
