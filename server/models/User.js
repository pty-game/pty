import Sequelize from 'sequelize';
import gameConfig from '../game-config';

export default (sequelize) => {
  return sequelize.define('User', {
    login: Sequelize.STRING,
    experience: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    nextLevelExperience: {
      type: Sequelize.INTEGER,
      defaultValue: gameConfig.GAME_WON_EXPERIENCE_VALUE,
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    gamesTotal: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    gamesWon: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    gamesLoose: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    gamesDraw: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  }, {
    name: {
      singular: 'user',
      plural: 'users',
    },
  });
};
