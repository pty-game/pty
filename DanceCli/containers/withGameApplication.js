import { connect } from 'react-redux';
import { gameApplicationCreate } from '../redux/modules/game-application';

export default (WrappedComponent) => {
  return connect(
    null,
    (dispatch) => {
      return {
        gameApplicationCreate: ({ isEstimator }) => {
          return dispatch(gameApplicationCreate({ isEstimator }));
        },
      };
    },
  )(WrappedComponent);
};
