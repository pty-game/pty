import { call, put, takeLatest } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import fetch from '../../helpers/fetch';
import WS from '../../helpers/ws';
import { toggleDrawer } from './drawer';

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

export const signUp = ({ login, password }) => {
  return {
    type: 'SIGN_UP_START',
    login,
    password,
  };
};

export const logOut = () => {
  return {
    type: 'LOG_OUT',
  };
};

export const signInSucceededCb = function* ({ token }) {
  yield AsyncStorage.setItem('token', token);
};

export const logOutCb = function* () {
  yield AsyncStorage.clear();
  yield put(toggleDrawer(false));
  Actions.authentication();
};

export const signInCb = function* ({ login, password }) {
  try {
    const { body: { token, user } } = yield call(fetch, 'sign-in', {
      values: { login, password },
      method: 'POST',
    });

    yield put({ type: 'SIGN_IN_SUCCEEDED', token, user });
  } catch (err) {
    console.log('err', err)
    if (err.status) {
      yield put({ type: 'SIGN_IN_FAILED', signInError: err.body.error });
    } else {
      throw err;
    }
  }
};

export const signUpCb = function* ({ login, password }) {
  try {
    const { body: { token, user } } = yield call(fetch, 'sign-up', {
      values: { login, password },
      method: 'POST',
    });
    yield put({ type: 'SIGN_UP_SUCCEEDED', token, user });
  } catch (err) {
    if (err.status) {
      yield put({ type: 'SIGN_UP_FAILED', signUpError: err.body.error });
    } else {
      throw err;
    }
  }
};

const socketConnect = (token) => {
  WS.instance.setToken(token);
  WS.instance.connect();

  return new Promise((resolve) => {
    WS.instance.on('SUBSCRIBED', (userData) => {
      resolve(userData);
    });
  });
};

export const subscribeCb = function* ({ token }) {
  const userData = yield call(socketConnect, token);
  yield put({ type: 'SUBSCRIBE_SUCCEEDED', userData });

  yield new Promise((resolve) => {
    WS.instance.on('LOG_OUT', () => {
      resolve(userData);
    });
  });

  yield put(logOut());
};

export const subscribeSucceeddedCb = () => {
};

const initialState = {
  token: undefined,
  userData: undefined,
  signInError: undefined,
  signUpError: undefined,
};

export const authenticationReducer = (
  state = initialState,
  { type, token, userData, signInError, signUpError },
) => {
  switch (type) {
    case 'SIGN_IN_START':
      return { ...initialState };
    case 'SIGN_UP_START':
      return { ...initialState };
    case 'SIGN_IN_SUCCEEDED':
      return { ...state, token, signInError: null };
    case 'SIGN_UP_SUCCEEDED':
      return { ...state, token, signUpError: null };
    case 'SIGN_IN_FAILED':
      return { ...state, signInError };
    case 'SIGN_UP_FAILED':
      return { ...state, signUpError };
    case 'SUBSCRIBE_SUCCEEDED':
      return { ...state, userData, signInError: null, signUpError: null };
    case 'LOG_OUT':
      return { ...initialState };
    default:
      return state;
  }
};

export const authenticationSaga = function* () {
  yield takeLatest('SIGN_IN_START', signInCb);
  yield takeLatest('SIGN_UP_START', signUpCb);
  yield takeLatest('SIGN_IN_SUCCEEDED', signInSucceededCb);
  yield takeLatest('SIGN_UP_SUCCEEDED', signInSucceededCb);
  yield takeLatest('SUBSCRIBE', subscribeCb);
  yield takeLatest('SUBSCRIBE_SUCCEEDED', subscribeSucceeddedCb);
  yield takeLatest('LOG_OUT', logOutCb);
};
