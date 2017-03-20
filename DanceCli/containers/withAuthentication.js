import { connect } from 'react-redux';
import { signIn, signUp, subscribe } from '../redux/modules/authentication';

export default (WrappedComponent) => {
  return connect(
    ({ authentication: { token, userData, signInError, signUpError } }) => {
      return {
        token,
        userData,
        signInError,
        signUpError,
      };
    },
    (dispatch) => {
      return {
        signIn: ({ login, password }) => {
          return dispatch(signIn({ login, password }));
        },
        signUp: ({ login, password }) => {
          return dispatch(signUp({ login, password }));
        },
        subscribe: (token) => {
          return dispatch(subscribe(token));
        },
      };
    },
  )(WrappedComponent);
};
