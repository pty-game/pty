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

  async iterationForEstimator({ gameApplication, gameApplications, index }) {
    const gameWithMinEstimators = await this.gameCtrl.findWithMinEstimators({
      finderUserId: gameApplication.userId,
    });

    if (!gameWithMinEstimators) {
      return { game: null, createdGameUsers: [] };
    }

    const createdGameUser = await this.db.GameUser.create({
      userId: gameApplication.userId,
      gameId: gameWithMinEstimators.id,
      isEstimator: true,
    });

    await gameApplication.destroy();
    gameApplications.splice(index, 1);

    return { game: gameWithMinEstimators, createdGameUsers: [createdGameUser] };
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
      return { game: null, createdGameUsers: [] };
    }

    const game = await this.gameCtrl.create();
    const gameId = game.id;

    if (
      !gameApplicationSub
    ) {
      const bot = await this.gameCtrl.createBotForGame({
        game,
        isEstimator: false,
        gameApplicationUserId: gameApplication.userId,
      });

      if (!bot) {
        await game.destroy();

        return { game: null, createdGameUsers: [] };
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

    const createdGameUsers = await Promise.all(gameUsers.map((gameUser) => {
      return this.db.GameUser.create(gameUser);
    }));

    game.gameUsers = createdGameUsers;

    await gameApplication.destroy();

    gameApplications.splice(index, 1);

    if (gameApplicationSub) {
      await gameApplicationSub.destroy();

      const subIndex = gameApplications.findIndex((item) => {
        return item.id === gameApplicationSub.id;
      });
      gameApplications.splice(subIndex, 1);
    }

    return { game, createdGameUsers };
    /* eslint-enable no-param-reassign */
  }

  async gameApplicationIteration({ gameApplications, index = 0, result = [] }) {
    /* eslint-disable no-param-reassign */
    const gameApplication = gameApplications[index];

    if (!gameApplication) {
      return result;
    }

    gameApplication.residueTime -= gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT;

    const newResult = [...result];

    if (gameApplication.residueTime < 0) {
      await this.gameApplicationExpired({ gameApplication, gameApplications, index });
    } else {
      await gameApplication.save();
      const specialIterationFn = !gameApplication.isEstimator ?
      this.iterationForPlayer :
      this.iterationForEstimator;

      const { game, createdGameUsers } = await specialIterationFn.call(this, {
        gameApplication,
        gameApplications,
        index,
      });

      if (game) {
        index -= 1;

        const userIds = createdGameUsers.map((gameUser) => {
          return gameUser.userId;
        });

        if (!gameApplication.isEstimator) {
          this.gameCtrl.start({ gameId: game.id });
        } else {
          game.dataValues.actions = await game.getGameActions();
        }

        newResult.push({ game, createdGameUsers });

        this.ws.send(
          userIds,
          'GAME_FOUND',
          game.toJSON(),
        );
      }
    }

    return this.gameApplicationIteration({ gameApplications, index: index + 1, result: newResult });
    /* eslint-enable no-param-reassign */
  }

  async interval() {
    const gameApplications = await this.db.GameApplication.findAll();

    const result = await this.gameApplicationIteration({ gameApplications });

    return result;
  }
}
