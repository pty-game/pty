import React, { Component } from 'react';
import {
 View,
} from 'react-native';
import Sound from 'react-native-sound';
import VideoRun from 'react-native-video';

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

export default class Video extends Component {
  constructor() {
    super();
    this.playPlayback();
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

  render() {
    return (<View style={styles.container}>
      <VideoRun
        ref={(ref) => {
          this.player = ref;
        }}
        source={{ uri: 'cloud.mp4' }}
        rate={1.0}
        volume={0}
        muted
        paused={false}
        resizeMode="cover"
        repeat
        onLoadStart={() => {
          console.log(1);
        }}
        onLoad={() => {
          console.log(2);
        }}
        onProgress={() => {
          console.log(3);
        }}
        onEnd={() => {
          console.log(4);
        }}
        onError={(err) => {
          console.log(5, err);
        }}
        style={styles.backgroundVideo}
      />
    </View>);
  }
}
