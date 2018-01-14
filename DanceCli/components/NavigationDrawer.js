import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'react-native-drawer';
import Menu from './Menu';
import withDrawer from '../containers/withDrawer';

class NavigationDrawer extends Component {
  componentDidMount() {
    this.props.setDrawer(this.drawer);
  }

  render() {
    return (
      <Drawer
        ref={(ref) => {
          this.drawer = ref;
        }}
        content={<Menu />}
        open={false}
        type="displace"
        tapToClose
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan
        tweenHandler={(ratio) => {
          return {
            main: { opacity: Math.max(0.54, 1 - ratio) },
          };
        }}
        tweenEasing="easeInQuad"
      >
        {this.props.children}
      </Drawer>
    );
  }
}

NavigationDrawer.propTypes = {
  children: PropTypes.element.isRequired,
  setDrawer: PropTypes.func.isRequired,
};

export default withDrawer(NavigationDrawer);
