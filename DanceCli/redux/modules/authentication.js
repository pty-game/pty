import { call, put, takeLatest } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import fetch from '../../helpers/fetch';
import WS from '../../helpers/ws';
import { baseUrlSocket } from '../../config';
import { wsGenerateMessage, wsParseMessage } from 'pty-common/wsMessage';

AsyncStorage.clear();

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
    const { body: { token, user } } = yield call(fetch, 'sign-in', {
      values: { login, password },
      method: 'POST',
    });

    yield put({ type: 'SIGN_IN_SUCCEEDED', token, user });
  } catch (err) {
    if (err.status) {
      yield put({ type: 'SIGN_IN_FETCH_FAILED', error: err.body.error });
    } else {
      throw err;
    }
  }
};

const socketConnect = (token) => {
  const ws = WS.init({ baseUrlSocket, token, wsGenerateMessage, wsParseMessage });

  ws.connect();

  return new Promise((resolve) => {
    ws.on('subscribed', (userData) => {
      resolve(userData);
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
  error: null,
};

export const authenticationReducer = (
  state = initialState,
  { type, token, userData, error },
) => {
  switch (type) {
    case 'SIGN_IN_START':
      return { ...initialState };
    case 'SIGN_IN_SUCCEEDED':
      return { ...state, token, error: null };
    case 'SIGN_IN_FETCH_FAILED':
      return { ...state, error };
    case 'SUBSCRIBE_SUCCEEDED':
      return { ...state, userData, error: null };
    default:
      return state;
  }
};

export const authenticationSaga = function* () {
  yield takeLatest('SIGN_IN_START', signInCb);
  yield takeLatest('SIGN_IN_SUCCEEDED', signInSucceededCb);
  yield takeLatest('SUBSCRIBE', subscribeCb);
};
