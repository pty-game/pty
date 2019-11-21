import { takeLatest, select } from 'redux-saga/effects';

export const setDrawer = (drawer) => {
  return {
    type: 'SET_DRAWER',
    drawer,
  };
};

export const toggleDrawer = (value) => {
  return {
    type: 'TOGGLE_DRAWER',
    value,
  };
};

export const toggleDrawerCb = function* ({ value }) {
  const { drawer: { drawer } } = yield select();
  if (value) {
    drawer.open();
  } else {
    drawer.close();
  }
};

const initialState = {
  drawer: undefined,
};

export const drawerReducer = (
  state = initialState,
  { type, drawer },
) => {
  switch (type) {
    case 'SET_DRAWER':
      return { drawer };
    default:
      return state;
  }
};

export const drawerSaga = function* () {
  yield takeLatest('TOGGLE_DRAWER', toggleDrawerCb);
};
