import gameConfig from '../game-config';

export default class ApplicationsConnect {
  constructor(db, ws, gameCtrl) {
    this.db = db;
    this.ws = ws;
    this.gameCtrl = gameCtrl;
  }
  async findOpponentForPlayer({ gameApplication, gameApplications }) {
    return gameApplications.find((gameApplicationSub) => {
      return !gameApplicationSub.isEstimator &&
        gameApplication.id !== gameApplicationSub.id;
    });
  }

  async iterationForEstimator({ gameApplication }) {
    const gameWithMinEstimators = await this.gameCtrl.findWithMinEstimators({
      finderUserId: gameApplication.userId,
    });

    if (!gameWithMinEstimators) {
      return null;
    }

    await this.db.GameUser.create({
      userId: gameApplication.user,
      gameId: gameWithMinEstimators.id,
      is_estimator: true,
    });

    await gameApplication.destroy();

    return gameWithMinEstimators;
  }

  async iterationForPlayer({ gameApplication, gameApplications, index }) {
    /* eslint-disable no-param-reassign */
    const gameApplicationSub = await this.findOpponentForPlayer({
      gameApplication,
      gameApplications,
    });

    if (
      !gameApplicationSub &&
      gameApplication.residueTime > gameConfig.RESIDUE_TIME_FOR_PAINTER_BOTS
    ) {
      return null;
    }

    const game = await this.gameCtrl.create();
    const gameId = game.id;

    if (
      !gameApplicationSub &&
      gameApplication.residueTime <= gameConfig.RESIDUE_TIME_FOR_PAINTER_BOTS
    ) {
      const bot = await this.gameCtrl.createBotForGame({
        game,
        isEstimator: false,
        gameApplicationUserId: gameApplication.userId,
      });

      if (!bot) {
        await game.destroy();

        return null;
      }
    }

    const gameUsers = [
      {
        userId: gameApplication.userId,
        gameId,
        isEstimator: false,
      },
    ];

    if (gameApplicationSub) {
      gameUsers.push({
        userId: gameApplicationSub.userId,
        gameId,
        is_estimator: false,
      });
    }

    await this.db.GameUser.bulkCreate(gameUsers);

    game.gameUsers = gameUsers;

    await gameApplication.destroy();

    gameApplications.splice(index, 1);

    index -= 1;

    if (gameApplicationSub) {
      await gameApplicationSub.destroy();

      const subIndex = gameApplications.indexOf((item) => {
        return item.id === gameApplicationSub.id;
      });

      gameApplications.splice(subIndex, 1);
    }

    return game;
    /* eslint-enable no-param-reassign */
  }

  async gameApplicationExpired({ gameApplication, gameApplications, index }) {
    /* eslint-disable no-param-reassign */
    await gameApplication.destroy();

    gameApplications.splice(index, 1);
    index -= 1;

    this.ws.send(
      gameApplication.userId,
      'GAME_APPLICATION_EXPIRED',
    );
    /* eslint-enable no-param-reassign */
  }

  async gameApplicationIteration({ gameApplications, index = 0 }) {
    /* eslint-disable no-param-reassign */
    const gameApplication = gameApplications[index];

    if (!gameApplication) {
      return true;
    }

    gameApplication.residueTime -= gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT;

    if (gameApplication.residueTime < 0) {
      await this.gameApplicationExpired({ gameApplication, gameApplications, index });
    } else {
      await gameApplication.save();

      const specialIterationFn = !gameApplication.isEstimator ?
      this.iterationForPlayer :
      this.iterationForEstimator;

      const game = await specialIterationFn.call(this, {
        gameApplication,
        gameApplications,
        index,
      });

      if (game) {
        const userIds = game.gameUsers.map((gameUser) => {
          return gameUser.userId;
        });

        this.ws.send(userIds, 'GAME_FOUND', { gameId: game.id });
      }
    }

    return this.gameApplicationIteration({ gameApplications, index: index + 1 });
    /* eslint-enable no-param-reassign */
  }

  async interval() {
    const gameApplications = await this.db.GameApplication.findAll();

    const result = await this.gameApplicationIteration({ gameApplications });

    return result;
  }
}
