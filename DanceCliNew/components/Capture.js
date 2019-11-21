import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import { Actions } from 'react-native-router-flux';
import { Text } from 'native-base';
import { View } from 'react-native';
import withGame from '../containers/withGame';

const styles = {
  text: {
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    position: 'relative',
    padding: 20,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
};

class Capture extends Component {
  constructor() {
    super();

    this.state = {
      isCapture: false,
    };
  }
  componentWillReceiveProps({ prepearingResidueTime, playingResidueTime }) {
    if (prepearingResidueTime === 0 && this.props.prepearingResidueTime > 0) {
      this.startCapture();
      this.props.startGamePlayback();
    }

    if (playingResidueTime === 0 && this.props.playingResidueTime > 0) {
      this.stopCapture();
      this.props.stopGamePlayback();

      Actions.estimation();
    }
  }

  startCapture() {
    this.camera.capture()
    .then((data) => {
      console.log(11, data);

      if (data.size) {
        console.log(`${(data.size / 1000000).toFixed(2)} MB`);
      }

      return RNFS.readFile(data.path, 'base64');
    })
    .then((file) => {
      return this.props.addPlayerGameAction({ file });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  stopCapture() {
    this.camera.stopCapture();
  }

  render() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.camera}
        captureMode={Camera.constants.CaptureMode.video}
        orientation={Camera.constants.Orientation.auto}
        aspect={Camera.constants.Aspect.fill}
        captureTarget={Camera.constants.CaptureTarget.temp}
        captureQuality={Camera.constants.CaptureQuality.medium}
      >
        <View style={styles.cameraView}>
          {
            this.props.prepearingResidueTime > 0 && <View style={styles.overlay} />
          }
          {
            this.props.prepearingResidueTime > 0 &&
            <Text style={styles.text}>
              {
                `Video recording will start in ${this.props.prepearingResidueTime} sec. Put your device on ` +
                'the proper surface in vertical position, and prepare to dance! ' +
                'You have to dance when the music starts playing.'
              }
            </Text>
          }
          {
            this.props.prepearingResidueTime === 0 && this.props.playingResidueTime > 0 &&
            <Text style={styles.text}>{`Recording ${this.props.playingResidueTime}`}</Text>
          }
        </View>
      </Camera>
    );
  }
}

Capture.propTypes = {
  addPlayerGameAction: PropTypes.func.isRequired,
  startGamePlayback: PropTypes.func.isRequired,
  stopGamePlayback: PropTypes.func.isRequired,
  playerGameActionAdded: PropTypes.func.isRequired,
  prepearingResidueTime: PropTypes.number.isRequired,
  playingResidueTime: PropTypes.number.isRequired,
};

export default withGame(Capture);
