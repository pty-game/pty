import {
    AppRegistry,
    View,
} from 'react-native';
import { Provider } from 'react-redux';
import React from 'react';
import { Scene, Router, Stack, ActionConst, Lightbox } from 'react-native-router-flux';
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

const styles = {
  container: {
    backgroundColor: 'rgb(255,245,201)',
  },
};
const DanceCliNew = () => {
  return (
    <Provider store={store}>
      <NavigationDrawer>
        <Router hideNavBar>
          <Scene key="root" hideNavBar cardStyle={styles.container}>
            <Scene key="authentication" component={Authentication} />
            <Scene key="signUpSuccess" component={SignUpSuccess} />
            <Scene key="home" component={Home} />
            <Scene key="pending" component={Pending} />
            <Scene key="capture" component={Capture} />
            <Scene key="estimation" component={Estimation} />
            <Scene key="video" component={Video} />
            <Scene key="error" component={Error} />
            <Scene key="gameResult" component={GameResult} />
          </Scene>
        </Router>
      </NavigationDrawer>
    </Provider>
  );
};

sagaMiddleware.run(rootSaga);

AppRegistry.registerComponent('DanceCliNew', () => {
    return DanceCliNew;
});

export default DanceCliNew;
