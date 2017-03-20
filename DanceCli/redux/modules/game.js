import { takeLatest } from 'redux-saga/effects';
import WS from '../../helpers/ws';

export const gameFoundCb = () => {
  WS.instance.on('GAME_ACTION_ADDED', () => {
  });
  WS.instance.on('ACTION_ADDED', () => {
  });
};

const initialState = {
};

export const gameReducer = (
  state = initialState,
  { type },
) => {
  switch (type) {
    default:
      return state;
  }
};

export const gameSaga = function* () {
  yield takeLatest('GAME_INIT', gameFoundCb);
};
