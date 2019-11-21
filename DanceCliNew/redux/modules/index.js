import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import { authenticationReducer, authenticationSaga } from './authentication';
import { gameApplicationReducer, gameApplicationSaga } from './game-application';
import { gameReducer, gameSaga } from './game';
import { drawerReducer, drawerSaga } from './drawer';

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
  gameApplication: gameApplicationReducer,
  game: gameReducer,
  drawer: drawerReducer,
});

export const rootSaga = function* () {
  yield all([
    authenticationSaga(),
    gameApplicationSaga(),
    gameSaga(),
    drawerSaga()
  ]);
};
