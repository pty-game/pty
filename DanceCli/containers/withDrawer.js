import { connect } from 'react-redux';
import { toggleDrawer, setDrawer } from '../redux/modules/drawer';

export default (WrappedComponent) => {
  return connect(
    null,
    (dispatch) => {
      return {
        toggleDrawer: (value) => {
          return dispatch(toggleDrawer(value));
        },
        setDrawer: (drawer) => {
          return dispatch(setDrawer(drawer));
        },
      };
    },
  )(WrappedComponent);
};
