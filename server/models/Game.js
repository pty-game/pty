import Sequelize from 'sequelize';
import gameConfig from '../game-config';

export default (sequelize) => {
  return sequelize.define('Game', {
    residueTime: {
      type: Sequelize.INTEGER,
      defaultValue: gameConfig.GAME_DURATION,
    },
  }, {
    classMethods: {
      associate(models) {
        models.Game.belongsTo(models.Task, { foreignKey: 'taskId' });
        models.Game.hasMany(models.GameAction, { foreignKey: 'gameId' });
        models.Game.hasMany(models.GameUser, { foreignKey: 'gameId' });
      },
    },
  });
};
