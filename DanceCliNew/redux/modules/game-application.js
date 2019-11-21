import { takeLatest, put, call } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import WS from '../../helpers/ws';

export const gameApplicationCreate = ({ isEstimator }) => {
  return {
    type: 'GAME_APPLICATION_CREATE',
    isEstimator,
  };
};

export const gameApplicationCreateFn = (isEstimator) => {
  WS.instance.send('GAME_APPLICATION_CREATE', { isEstimator });

  return new Promise((resolve, reject) => {
    WS.instance.on('GAME_FOUND', ({ gameId, residueTime, actions }) => {
      resolve({ gameId, residueTime, actions });
    });

    WS.instance.on('GAME_APPLICATION_EXPIRED', (err) => {
      WS.instance.off('GAME_FOUND');
      WS.instance.off('GAME_APPLICATION_EXPIRED');

      reject(err);
    });
  });
};

export const gameApplicationCreateCb = function* ({ isEstimator }) {
  Actions.pending();

  try {
    const { gameId, residueTime, actions } = yield call(gameApplicationCreateFn, isEstimator);
    yield put({ type: 'GAME_FOUND', isEstimator, gameId, residueTime, actions });
  } catch (err) {
    Actions.error({
      text: 'Sorry, we can\'t find opponents for you. Try again later.',
    });

    setTimeout(() => {
      Actions.home();
    }, 3000);
  }
};

export const gameFoundCb = function* ({ isEstimator, gameId, residueTime, actions }) {
  yield put({ type: 'GAME_INIT', isEstimator, gameId, residueTime, actions });
};

const initialState = {
};

export const gameApplicationReducer = (
  state = initialState,
  { type },
) => {
  switch (type) {
    default:
      return state;
  }
};

export const gameApplicationSaga = function* () {
  yield takeLatest('GAME_APPLICATION_CREATE', gameApplicationCreateCb);
  yield takeLatest('GAME_FOUND', gameFoundCb);
};
