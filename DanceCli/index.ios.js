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
import GameResult from './components/GameResult';
import Error from './components/Error';
import NavigationDrawer from './components/NavigationDrawer';
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
        <Scene key="drawer" component={NavigationDrawer} open={false}>
          <Scene
            key="main"
            tabs
            passProps
            navigationBarStyle={{
              backgroundColor: 'transparent',
              borderBottomColor: 'transparent',
            }}
          >
            <Scene
              key="authentication"
              component={Authentication}
              hideNavBar
            />
            <Scene key="signUpSuccess" component={SignUpSuccess} hideNavBar />
            <Scene
              key="home"
              component={Home}
            />
            <Scene key="pending" component={Pending} hideNavBar />
            <Scene key="capture" component={Capture} hideNavBar />
            <Scene key="estimation" component={Estimation} hideNavBar />
            <Scene key="video" component={Video} hideNavBar />
            <Scene key="error" component={Error} hideNavBar />
            <Scene key="gameResult" component={GameResult} hideNavBar />
          </Scene>
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
