import { compose, applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga as _rootSaga } from './modules';


export const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, logger];

export default (initialState) => {
  return compose(
    applyMiddleware(...middlewares),
  )(createStore)(rootReducer, initialState);
};

export const rootSaga = _rootSaga;
