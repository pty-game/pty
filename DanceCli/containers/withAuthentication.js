import { connect } from 'react-redux';
import { signIn, subscribe } from '../redux/modules/authentication';

export default (WrappedComponent) => {
  return connect(
    ({ authentication: { token, userData, error } }) => {
      return {
        token,
        userData,
        error,
      };
    },
    (dispatch) => {
      return {
        signIn: ({ login, password }) => {
          return dispatch(signIn({ login, password }));
        },
        subscribe: (token) => {
          return dispatch(subscribe(token));
        },
      };
    },
  )(WrappedComponent);
};
