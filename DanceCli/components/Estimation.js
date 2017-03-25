import React, { PropTypes } from 'react';
import { View, Image } from 'react-native';
import RNFS from 'react-native-fs';
import { Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Button from './Button';
import withGame from '../containers/withGame';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
};

const EstimationItem = ({ playerGameAction }) => {
  return (
    <View>
      <Image
        style={{ width: 130, height: 200 }}
        source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
      />
      {
        playerGameAction &&
        <Button
          onPress={() => {
            const videoPath = `${RNFS.DocumentDirectoryPath}/test.mp4`;
            RNFS.writeFile(videoPath, playerGameAction.file, 'base64')
            .then(() => {
              Actions.video({ videoPath });
            })
            .catch((err) => {
              console.error(err);
            });
          }}
        >
          <Text>
            Watch
          </Text>
        </Button>
      }
      {
        playerGameAction &&
        <Button>
          <Text>
            Vote
          </Text>
        </Button>
      }
    </View>
  );
};

EstimationItem.defaultProps = {
  playerGameAction: null,
};

EstimationItem.propTypes = {
  playerGameAction: PropTypes.object,
};

const Estimation = ({ playersGameActions }) => {
  return (
    <View style={styles.container}>
      <EstimationItem playerGameAction={playersGameActions[0]} />
      <EstimationItem playerGameAction={playersGameActions[1]} />
    </View>
  );
};

Estimation.propTypes = {
  playersGameActions: PropTypes.array.isRequired,
};

export default withGame(Estimation);
