import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';
import { userReducer, userSaga } from './user';

export const rootReducer = combineReducers({
  user: userReducer,
});

export const rootSaga = function* () {
  yield [
    fork(userSaga),
  ];
};
