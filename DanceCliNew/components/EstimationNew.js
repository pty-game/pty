import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Container from './Container';
import { Video } from './Video';
import VideoRun from "react-native-video";
import VideoFile from "./dance.mp4";

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  side: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  left: {
    backgroundColor: 'red',
  },
  right: {
    backgroundColor: 'blue',
  }
};

const EstimationNew = ({
}) => {
  const [paused, setPaused] = useState(true);
  const [isReady, setIsReady] = useState(0);

  useEffect(() => {
    if (isReady !== 2) return;

    setTimeout(() => {
      setPaused(false);
    }, 1000)
  }, [isReady]);

  return (
    <View style={styles.container}>
      <View style={[styles.left, styles.side]}>
        <VideoRun
          ref={(ref) => {
            this.player = ref;
          }}
          source={VideoFile}
          rate={1.0}
          volume={0}
          muted
          paused={paused}
          resizeMode="cover"
          onLoad={() => setIsReady(isReady + 1)}
          onProgress={() => {
          }}
          onEnd={() => {
          }}
          onError={(err) => {
            console.log(5, err);
          }}
          style={styles.backgroundVideo}
        />
      </View>
      <View style={[styles.right, styles.side]}>
        <VideoRun
          ref={(ref) => {
            this.player = ref;
          }}
          source={VideoFile}
          rate={1.0}
          volume={0}
          muted
          paused={paused}
          resizeMode="cover"
          onLoad={() => setIsReady(isReady + 1)}
          onProgress={() => {
          }}
          onEnd={() => {
          }}
          onError={(err) => {
            console.log(5, err);
          }}
          style={styles.backgroundVideo}
        />
      </View>
    </View>
  );
};

EstimationNew.propTypes = {
};

export default EstimationNew;
