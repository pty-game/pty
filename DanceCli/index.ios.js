import {
  AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';
import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Home from './components/Home';
import Pending from './components/Pending';
import Capture from './components/Capture';
import Estimation from './components/Estimation';
import Video from './components/Video';
import Authentication from './components/Authentication';
import createStore, { sagaMiddleware, rootSaga } from './redux';

/* global window */
window.navigator.userAgent = 'ReactNative';

const store = createStore();

const DanceCli = () => {
  return (
    <Provider store={store}>
      <Router>
        <Scene key="root">
          <Scene key="authentication" initial component={Authentication} hideNavBar />
          <Scene key="home" component={Home} />
          <Scene key="pending" component={Pending} />
          <Scene key="capture" component={Capture} hideNavBar />
          <Scene key="estimation" component={Estimation} />
          <Scene key="video" component={Video} hideNavBar />
        </Scene>
      </Router>
    </Provider>
  );
};

sagaMiddleware.run(rootSaga);

AppRegistry.registerComponent('DanceCli', () => {
  return DanceCli;
});

export default DanceCli;
