import Sequelize from 'sequelize';
import gameConfig from '../game-config';

export default (sequelize) => {
  return sequelize.define('GameUser', {
    isEstimator: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    residueTime: {
      type: Sequelize.INTEGER,
      defaultValue: gameConfig.GAME_APPLICATION_DURATION,
    },
  }, {
    classMethods: {
      associate(models) {
        models.GameUser.belongsTo(models.User, { foreignKey: 'userId' });
        models.GameUser.belongsTo(models.Game, { foreignKey: 'gameId' });
      },
    },
  });
};
