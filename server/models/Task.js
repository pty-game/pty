import Sequelize from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Task', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  });
};
