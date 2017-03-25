import { connect } from 'react-redux';
import {
  addPlayerGameAction,
  addEstimatorGameAction,
  startGamePlayback,
  stopGamePlayback,
  playerGameActionAdded,
  estimatorGameActionAdded,
} from '../redux/modules/game';

export default (WrappedComponent) => {
  return connect(
    ({
      game: {
        playersGameActions,
        estimatorsGameActions,
        prepearingResidueTime,
        playingResidueTime,
      },
    }) => {
      return {
        playersGameActions,
        estimatorsGameActions,
        prepearingResidueTime,
        playingResidueTime,
      };
    },
    (dispatch) => {
      return {
        addPlayerGameAction: ({ file }) => {
          return dispatch(addPlayerGameAction({ file }));
        },
        addEstimatorGameAction: ({ gameUserId }) => {
          return dispatch(addEstimatorGameAction({ gameUserId }));
        },
        startGamePlayback: () => {
          return dispatch(startGamePlayback());
        },
        stopGamePlayback: () => {
          return dispatch(stopGamePlayback());
        },
        playerGameActionAdded: ({ file }) => {
          return dispatch(playerGameActionAdded({ file }));
        },
        estimatorGameActionAdded: () => {
          return dispatch(estimatorGameActionAdded());
        },
      };
    },
  )(WrappedComponent);
};
