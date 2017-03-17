import { call, put, takeLatest } from 'redux-saga/effects';
import io from 'socket.io-client';
import { AsyncStorage } from 'react-native';
import fetch from '../../helpers/fetch';

export const subscribe = (token) => {
  return {
    type: 'SUBSCRIBE',
    token,
  };
};

export const signIn = ({ login, password }) => {
  return {
    type: 'SIGN_IN_START',
    login,
    password,
  };
};

export const signInSucceededCb = function* ({ token }) {
  yield AsyncStorage.setItem('token', token);
};

export const signInCb = function* ({ login, password }) {
  try {
    const { body: { token, user } } = yield call(fetch, 'http://localhost:3000/sign-in', {
      values: { login, password },
      method: 'POST',
    });
    yield put({ type: 'SIGN_IN_SUCCEEDED', token, user });
  } catch (err) {
    if (err.status) {
      yield put({ type: 'SIGN_IN_FETCH_FAILED', error: err.message });
    } else {
      console.error(err);
    }
  }
};

const socketConnect = (token) => {
  const socket = io('localhost:3001', {
    transports: ['websocket'],
    query: `token=${token}`,
  });

  return new Promise((resolve) => {
    socket.on('subscribed', (response) => {
      resolve(response);
    });
  });
};

export const subscribeCb = function* ({ token }) {
  const userData = yield call(socketConnect, token);
  yield put({ type: 'SUBSCRIBE_SUCCEEDED', userData });
};

const initialState = {
  token: null,
  userData: null,
};

export const userReducer = (
  state = initialState,
  { type, token, userData },
) => {
  switch (type) {
    case 'SIGN_IN_SUCCEEDED':
      return { ...state, token };
    case 'SUBSCRIBE_SUCCEEDED':
      return { ...state, userData };
    default:
      return state;
  }
};

export const userSaga = function* () {
  yield takeLatest('SIGN_IN_START', signInCb);
  yield takeLatest('SIGN_IN_SUCCEEDED', signInSucceededCb);
  yield takeLatest('SUBSCRIBE', subscribeCb);
};
