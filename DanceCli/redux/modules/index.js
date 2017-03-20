import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';
import { authenticationReducer, authenticationSaga } from './authentication';
import { gameApplicationReducer, gameApplicationSaga } from './game-application';
import { gameReducer, gameSaga } from './game';

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
  gameApplication: gameApplicationReducer,
  game: gameReducer,
});

export const rootSaga = function* () {
  yield [
    fork(authenticationSaga),
    fork(gameApplicationSaga),
    fork(gameSaga),
  ];
};
