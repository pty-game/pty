import React, { useEffect, useState, useMemo } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { Icon } from 'native-base';
import { Video } from './Video';
import VideoRun from 'react-native-video';
import VideoFile1 from "./final_1.mp4";
import VideoFile2 from "./final_2.mp4";

const HEART_SIZE = 150;
const ACTION_BAR_SIZE = 0;
const HEART_SWIPE_TRESHOLD = 200;
const HEART_SWIPE_POSITION = 200;
const HEART_SCALE = 10;

const styles = {
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  backgroundVideo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  side: {
    zIndex: 0,
    height: '100%',
    position: 'relative',
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
  },
  actionBar: {
    width: ACTION_BAR_SIZE,
    backgroundColor: 'black',
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    marginLeft: -(ACTION_BAR_SIZE / 2),
    zIndex: 5,
  },
  actionHeartContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -(HEART_SIZE / 2),
    marginTop: -(HEART_SIZE / 2),
    width: HEART_SIZE,
    height: HEART_SIZE,
    alignItems: 'center',
  },
  actionHeart: {
    fontSize: HEART_SIZE,
    color: 'white',
  },
  actionArrowWrapper: {
    position: 'absolute',
    top: '50%',
    marginTop: -30,
  },
  actionArrow: {
    color: 'white',
    fontSize: 30,
  },
  actionArrowWrapperLeft: {
    left: -15,
  },
  actionArrowWrapperRight: {
    right: -15,
  },
  borderBlock: {
    zIndex: 5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '50%',
  }
};

const EstimationNew = ({
}) => {
  const [paused, setPaused] = useState(true);
  const [isReady, setIsReady] = useState(0);
  const [userSelected, setUserSelected] = useState(null);

  const translateXHeart = useMemo(() => new Animated.ValueXY({ x: 0, y: 0 }), []);
  const scaleHeart = useMemo(() => new Animated.Value(1), []);
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderMove: (evt, { dx, dy }) => {
      translateXHeart.setValue({ x: dx, y: dy / 4 });
    },
    onPanResponderRelease: (evt, { dx }) => {
      if (Math.abs(dx) < HEART_SWIPE_TRESHOLD) {
        Animated.timing(translateXHeart, {
          toValue: { x: 0, y: 0 },
        }).start();
      } else {
        Animated.timing(translateXHeart, {
          toValue: dx > 0 ? { y: 0, x: HEART_SWIPE_POSITION } : { x: -HEART_SWIPE_POSITION, y: 0 },
        }).start();
        Animated.timing(scaleHeart, {
          toValue: HEART_SCALE,
        }).start();
        setUserSelected(dx > 0 ? 1 : 0);
      }
    },
  }), []);

  useEffect(() => {
    if (isReady !== 2) return;

    setTimeout(() => {
      setPaused(false);
    }, 1000)
  }, [isReady]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={[styles.left, styles.side]}>
        <VideoRun
          ref={(ref) => {
            this.player = ref;
          }}
          source={VideoFile1}
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
          source={VideoFile2}
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
      <View style={styles.actionBar}>
        <Animated.View
          style={[
            styles.actionHeartContainer,
            { transform: [{ translateX: translateXHeart.x }, { translateY: translateXHeart.y }, { scale: scaleHeart }] },
            { opacity: scaleHeart.interpolate({ inputRange: [1, HEART_SCALE], outputRange: [1, 0] }) }
          ]}
        >
          <Icon type="Ionicons" name="heart" style={styles.actionHeart} />
          <Animated.View style={[
            styles.actionArrowWrapper,
            styles.actionArrowWrapperLeft,
            {
              opacity: translateXHeart.x.interpolate({
                inputRange: [-HEART_SWIPE_POSITION, 0, HEART_SWIPE_POSITION],
                outputRange: [0, 1, 0]
              })
            }
          ]}>
            <Icon
              type="FontAwesome"
              name="angle-left"
              style={styles.actionArrow}
            />
          </Animated.View>
          <Animated.View style={[
            styles.actionArrowWrapper,
            styles.actionArrowWrapperRight,
            {
              opacity: translateXHeart.x.interpolate({
                inputRange: [-HEART_SWIPE_POSITION, 0, HEART_SWIPE_POSITION],
                outputRange: [0, 1, 0]
              })
            }
          ]}>
            <Icon
              type="FontAwesome"
              name="angle-right"
              style={styles.actionArrow}
            />
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.borderBlock, {
            left: userSelected === 1 ? 0 : 'auto',
            right: userSelected === 0 ? 0 : 'auto'
          },
          {
            opacity: userSelected !== null ? 0.3 : 0,
          }
        ]}
      />
    </View>
  );
};

EstimationNew.propTypes = {
};

export default EstimationNew;
