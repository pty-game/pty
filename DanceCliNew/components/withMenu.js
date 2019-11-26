import React from 'react';
import { View, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import withDrawer from '../containers/withDrawer';

const menuBtnItemStyle = {
  width: 20,
  height: 3,
  backgroundColor: 'black',
  marginTop: 4,
};

const withMenu = (WrappedComponent) => {
  return withDrawer((props) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 30,
              left: 20,
              right: 20,
              zIndex: 333,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  props.toggleDrawer(true);
                }}
              >
                <View>
                  <View style={menuBtnItemStyle} />
                  <View style={menuBtnItemStyle} />
                  <View style={menuBtnItemStyle} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <WrappedComponent {...props} />
        </View>
      </SafeAreaView>
    );
  });
};

export default withMenu;
