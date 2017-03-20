import {
  AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';
import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Home from './components/Home';
import Pending from './components/Pending';
import Capture from './components/Capture';
import Game from './components/Game';
import Estimation from './components/Estimation';
import Video from './components/Video';
import Authentication from './components/Authentication';
import Error from './components/Error';
import createStore, { sagaMiddleware, rootSaga } from './redux';
import SignUpSuccess from './components/SignUpSuccess';
import { baseUrlSocket } from './config';
import WS from './helpers/ws';

WS.init({ baseUrlSocket });

const store = createStore();

const DanceCli = () => {
  return (
    <Provider store={store}>
      <Router>
        <Scene key="root">
          <Scene key="authentication" initial component={Authentication} hideNavBar />
          <Scene key="signUpSuccess" component={SignUpSuccess} hideNavBar />
          <Scene key="home" component={Home} hideNavBar />
          <Scene key="pending" component={Pending} hideNavBar />
          <Scene key="capture" component={Capture} hideNavBar />
          <Scene key="game" component={Game} hideNavBar />
          <Scene key="estimation" component={Estimation} hideNavBar />
          <Scene key="video" component={Video} hideNavBar />
          <Scene key="error" component={Error} hideNavBar />
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
