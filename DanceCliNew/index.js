import {
    AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';
import React from 'react';
import { Scene, Router, Stack } from 'react-native-router-flux';
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

const DanceCliNew = () => {
    return (
        <Provider store={store}>
        <NavigationDrawer>
            <Router
        passProps
        hideNavBar
        >
        <Stack key="root">
        <Scene key="authentication" component={Authentication} />
        <Scene key="signUpSuccess" component={SignUpSuccess} />
        <Scene key="home" component={Home} />
        <Scene key="pending" component={Pending} />
        <Scene key="capture" component={Capture} />
        <Scene key="estimation" component={Estimation} />
        <Scene key="video" component={Video} />
        <Scene key="error" component={Error} />
        <Scene key="gameResult" component={GameResult} />
        </Stack>
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
