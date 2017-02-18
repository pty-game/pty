import Sequelize from 'sequelize';
import gameConfig from '../game-config';

export default (sequelize) => {
  return sequelize.define('GameApplication', {
    isEstimator: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isBot: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    residueTime: {
      type: Sequelize.INTEGER,
      defaultValue: gameConfig.GAME_APPLICATION_DURATION,
    },
  }, {
    name: {
      singular: 'gameApplication',
      plural: 'gameApplications',
    },
    classMethods: {
      associate(models) {
        models.GameApplication.belongsTo(models.User, { foreignKey: 'userId' });
      },
    },
  });
};
