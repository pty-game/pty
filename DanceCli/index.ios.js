import {
  AppRegistry,
} from 'react-native';
import io from 'socket.io-client';
import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Home from './components/Home';
import Pending from './components/Pending';
import Capture from './components/Capture';
import Estimation from './components/Estimation';
import Video from './components/Video';

/* global window */
window.navigator.userAgent = 'ReactNative';

const socket = io('localhost:3001', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('connected!!');
});

const DanceCli = () => {
  return (<Router>
    <Scene key="root">
      <Scene key="home" component={Home} />
      <Scene key="pending" component={Pending} />
      <Scene key="capture" component={Capture} hideNavBar />
      <Scene key="estimation" component={Estimation} />
      <Scene key="video" component={Video} hideNavBar />
    </Scene>
  </Router>);
};

AppRegistry.registerComponent('DanceCli', () => {
  return DanceCli;
});

export default DanceCli;
