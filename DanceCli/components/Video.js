import React, { Component, PropTypes } from 'react';
import {
 View,
} from 'react-native';
import VideoRun from 'react-native-video';
import { Actions } from 'react-native-router-flux';
import withGame from '../containers/withGame';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  btn: {
    marginTop: 20,
  },
};

class Video extends Component {
  componentDidMount() {
    this.props.startGamePlayback();
  }

  render() {
    return (
      <View style={styles.container}>
        <VideoRun
          ref={(ref) => {
            this.player = ref;
          }}
          source={{ uri: this.props.videoPath }}
          rate={1.0}
          volume={0}
          muted
          paused={false}
          resizeMode="cover"
          onLoadStart={() => {
          }}
          onLoad={() => {
          }}
          onProgress={() => {
          }}
          onEnd={() => {
            this.props.stopGamePlayback();
            Actions.estimation();
          }}
          onError={(err) => {
            console.log(5, err);
          }}
          style={styles.backgroundVideo}
        />
      </View>
    );
  }
}

Video.propTypes = {
  videoPath: PropTypes.string.isRequired,
  startGamePlayback: PropTypes.func.isRequired,
  stopGamePlayback: PropTypes.func.isRequired,
};

export default withGame(Video);
