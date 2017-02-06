import Sequelize from 'sequelize';

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
