import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import RNFS from 'react-native-fs';
import { Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Button from './Button';
import { estimatorsGameActionShape } from './shapes';

const EstimationItem = ({
  playerGameAction,
  addEstimatorGameAction,
  estimatorsGameActions,
}) => {
  return (
    <View>
      {
        playerGameAction &&
        <Button
          onPress={() => {
            const videoPath = `${RNFS.DocumentDirectoryPath}/test.mp4`;
            RNFS.writeFile(videoPath, playerGameAction.action.file, 'base64')
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
        <View>
          <Button
            onPress={() => {
              addEstimatorGameAction({ gameUserId: playerGameAction.gameUserId });
            }}
          >
            <Text>
              Vote
            </Text>
          </Button>
          <Text>{estimatorsGameActions.length}</Text>
        </View>
      }
    </View>
  );
};

EstimationItem.defaultProps = {
  playerGameAction: null,
};

EstimationItem.propTypes = {
  playerGameAction: PropTypes.object,
  estimatorsGameActions: PropTypes.arrayOf(estimatorsGameActionShape).isRequired,
  addEstimatorGameAction: PropTypes.func.isRequired,
};

export default EstimationItem;
