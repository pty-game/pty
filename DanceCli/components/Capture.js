import React, { Component } from 'react';
import {
 Dimensions,
 View,
} from 'react-native';
import Camera from 'react-native-camera';
import { Text } from 'native-base';
import Sound from 'react-native-sound';


const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
  btn: {
    marginTop: 20,
  },
};

export default class Capture extends Component {
  constructor() {
    super();

    this.state = {
      isCapture: false,
    };
  }

  playPlayback() {
    Sound.setCategory('Playback');

    const track = new Sound(
      'https://freemusicarchive.org/music/download/cd03489ac769558c63563f39c1a0f65592d00019',
      '',
      (err) => {
        if (err) {
          console.error(err);
        } else {
          track.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
      },
    );
  }
  startCapture() {
    this.camera.capture();

    this.setState({ isCapture: true });
  }
  stopCapture() {
    this.camera.stopCapture();

    this.setState({ isCapture: false });
  }

  render() {
    return (<View style={styles.container}>
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        captureMode={Camera.constants.CaptureMode.video}
        orientation={Camera.constants.Orientation.auto}
        aspect={Camera.constants.Aspect.fill}
      >
        {
          !this.state.isCapture ?
            <Text onPress={() => { this.startCapture(); }}>CAPTURE</Text> :
            <Text onPress={() => { this.stopCapture(); }}>STOP CAPTURE</Text>
        }
      </Camera>
    </View>);
  }
}
