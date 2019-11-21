import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import withGame from '../containers/withGame';
import EstimationItem from './EstimationItem';
import { estimatorsGameActionShape } from './shapes';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
};

const getEstimatorsGameActionsForGameUserId = ({ gameUserId, estimatorsGameActions }) => {
  const clonedEstimatorsGameActions = estimatorsGameActions.slice(0);

  const result = clonedEstimatorsGameActions
  .reverse()
  .reduce((prev, item) => {
    const isExist = prev.findIndex((prevItem) => {
      return prevItem.gameUserId === item.gameUserId;
    }) !== -1;

    return isExist ? prev : [...prev, item];
  }, [])
  .filter((item) => {
    return item.action.gameUserId === gameUserId;
  });

  return result;
};

const Estimation = ({
  playersGameActions,
  estimatorsGameActions,
  addEstimatorGameAction,
}) => {
  return (
    <View style={styles.container}>
      <EstimationItem
        playerGameAction={playersGameActions[0]}
        estimatorsGameActions={
          playersGameActions[0] ?
            getEstimatorsGameActionsForGameUserId({
              gameUserId: playersGameActions[0].gameUserId,
              estimatorsGameActions,
            }) :
            []
        }
        addEstimatorGameAction={addEstimatorGameAction}
      />
      <EstimationItem
        playerGameAction={playersGameActions[1]}
        estimatorsGameActions={
          playersGameActions[1] ?
            getEstimatorsGameActionsForGameUserId({
              gameUserId: playersGameActions[1].gameUserId,
              estimatorsGameActions,
            }) :
            []
        }
        addEstimatorGameAction={addEstimatorGameAction}
      />
    </View>
  );
};

Estimation.propTypes = {
  playersGameActions: PropTypes.arrayOf(estimatorsGameActionShape).isRequired,
  estimatorsGameActions: PropTypes.arrayOf(estimatorsGameActionShape).isRequired,
  addEstimatorGameAction: PropTypes.func.isRequired,
};

export default withGame(Estimation);
