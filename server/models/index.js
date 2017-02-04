import Sequelize from 'sequelize';
import gameConfig from '../game-config';

export default (sequelize) => {
  // eslint-disable-next-line no-unused-vars
  const User = sequelize.define('user', {
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
  });

  // eslint-disable-next-line no-unused-vars
  const Game = sequelize.define('game', {
    residueTime: {
      type: Sequelize.INTEGER,
      defaultValue: gameConfig.GAME_DURATION,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const GameAction = sequelize.define('gameAction', {
    action: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const GameApplication = sequelize.define('gameApplication', {
    isEstimator: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    residueTime: {
      type: Sequelize.INTEGER,
      defaultValue: gameConfig.GAME_APPLICATION_DURATION,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const GameUser = sequelize.define('gameUser', {
    isEstimator: 'boolean',
    isBot: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  // eslint-disable-next-line no-unused-vars
  const Task = sequelize.define('task', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  });

  Game.belongsTo(Task);
  Game.hasMany(GameAction);
  Game.hasMany(GameUser);

  GameAction.belongsTo(GameUser);
  GameAction.belongsTo(Game);

  GameApplication.belongsTo(User);

  GameUser.belongsTo(User);
  GameUser.belongsTo(Game);
};
