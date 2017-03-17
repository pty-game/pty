import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';
import { authenticationReducer, authenticationSaga } from './authentication';

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
});

export const rootSaga = function* () {
  yield [
    fork(authenticationSaga),
  ];
};
