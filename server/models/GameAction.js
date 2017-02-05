import Sequelize from 'sequelize';

export default (sequelize) => {
  return sequelize.define('GameAction', {
    action: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate(models) {
        models.GameAction.belongsTo(models.GameUser, { foreignKey: 'gameUserId' });
        models.GameAction.belongsTo(models.Game, { foreignKey: 'gameId' });
      },
    },
  });
};
