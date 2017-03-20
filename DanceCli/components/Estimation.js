import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Container from './Container';
import Button from './Button';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
  },
  btn: {
    marginTop: 20,
  },
};

const EstimationItem = () => {
  return (<View>
    <Image
      style={{ width: 130, height: 200 }}
      source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
    />
    <Button style={styles.btn} block onPress={() => { Actions.video(); }}>
      <Text>
        Watch
      </Text>
    </Button>
    <Button style={styles.btn} block>
      <Text>
        Vote
      </Text>
    </Button>
  </View>);
};

const Estimation = () => {
  return (
    <Container>
      <View style={styles.container}>
        { EstimationItem() }
        { EstimationItem() }
      </View>
    </Container>
  );
};

export default Estimation;
