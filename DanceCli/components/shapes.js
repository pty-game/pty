import PropTypes from 'prop-types';

export const estimatorsGameActionShape = PropTypes.shape({
  action: PropTypes.object,
  gameUserId: PropTypes.number,
  gameId: PropTypes.number,
});
