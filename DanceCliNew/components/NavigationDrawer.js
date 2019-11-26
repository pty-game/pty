import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Menu from './Menu';
import withDrawer from '../containers/withDrawer';

class NavigationDrawer extends Component {
  componentDidMount() {
    this.props.setDrawer(this.drawer);
  }

  render() {
    return (
      <DrawerLayout
        ref={drawer => {
          this.drawer = drawer;
        }}
        drawerWidth={200}
        drawerPosition={DrawerLayout.positions.Right}
        drawerType='front'
        drawerBackgroundColor="#ddd"
        renderNavigationView={() => <Menu />}
      >
        {this.props.children}
      </DrawerLayout>
    );
  }
}

NavigationDrawer.propTypes = {
  children: PropTypes.element.isRequired,
  setDrawer: PropTypes.func.isRequired,
};

export default withDrawer(NavigationDrawer);
