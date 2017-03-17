import { compose, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga as _rootSaga } from './modules';

export const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export default (initialState) => {
  return compose(
    applyMiddleware(...middlewares),
  )(createStore)(rootReducer, initialState);
};

export const rootSaga = _rootSaga;
