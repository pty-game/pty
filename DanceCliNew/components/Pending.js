import React, { useEffect, useState, useCallback } from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';

import Container from './Container';
import { blueColor } from '../constants/colors';

const MAX_PROGRESS = 10;

const styles = {
  titleBlock: {
    marginTop: 50,
  },
  titleText1: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  titleText2: {
    fontSize: 70,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 100,
  }
};

const Pending = ({ navigation }) => {
  const error = useSelector(({ meta: { error } }) => error);

  const [progress, setProgress] = useState(MAX_PROGRESS);

  const progressIteration = useCallback(() => {
    setProgress(progress - 1);
  }, [progress]);

  useEffect(() => {
    if (error) navigation.navigate('Error');
  }, [error]);

  useEffect(() => {
    setTimeout(progressIteration, 1000)
  }, [progress]);
  return (
    <Container>
      <Progress.Circle
        borderColor="white"
        color="white"
        showsText={true}
        size={250}
        borderWidth={1}
        progress={(MAX_PROGRESS - progress) / 10}
        thickness={10}
        formatText={() => progress}
        textStyle={styles.progressText}
      />
      <View style={styles.titleBlock}>
        <Text style={styles.titleText1}>PREPARE TO</Text>
        <Text style={styles.titleText2}>DANCE!</Text>
      </View>
    </Container>
  );
};

export default Pending;
