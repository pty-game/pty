import { connect } from 'react-redux';
import { signIn, subscribe } from '../redux/modules/user';

export default (WrappedComponent) => {
  return connect(
    ({ user: { token, userData } }) => {
      return {
        token,
        userData,
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
