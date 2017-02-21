import gameConfig from '../game-config';
import GameCtrl from '../controllers/game';

const gameCtrl = new GameCtrl();

export default class ApplicationConnect {
  async findOpponentForPlayer({ gameApplication, gameApplications }) {
    return gameApplications.find((gameApplicationSub) => {
      return !gameApplicationSub.isEstimator &&
        gameApplication.id !== gameApplicationSub.id;
    });
  }

  async iterationForEstimator({ gameApplication, db }) {
    const gameWithMinEstimators = await gameCtrl.findWithMinEstimators({
      finderUserId: gameApplication.userId,
      db,
    });

    if (!gameWithMinEstimators) {
      return false;
    }

    await db.GameUser.create({
      userId: gameApplication.user,
      gameId: gameWithMinEstimators.id,
      is_estimator: true,
    });

    // TODO websocket
    // GameApplication.message(
    //   gameApplication.id,
    //   wsResponses.message('gameFound', {gameId: game.id})
    // )

    await gameApplication.destroy();

    return true;
  }

  async iterationForPlayer({ gameApplication, gameApplications, index, db }) {
    /* eslint-disable no-param-reassign */
    const gameApplicationSub = await this.findOpponentForPlayer({
      gameApplication,
      gameApplications,
    });

    if (
      !gameApplicationSub &&
      gameApplication.residueTime > gameConfig.RESIDUE_TIME_FOR_PAINTER_BOTS
    ) {
      return false;
    }

    const game = await gameCtrl.create({ db });
    const gameId = game.id;

    if (
      !gameApplicationSub &&
      gameApplication.residueTime <= gameConfig.RESIDUE_TIME_FOR_PAINTER_BOTS
    ) {
      const bot = await gameCtrl.createBotForGame({
        game,
        isEstimator: false,
        gameApplicationUserId: gameApplication.userId,
        db,
      });

      if (!bot) {
        await game.destroy();

        return false;
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

    await db.GameUser.bulkCreate(gameUsers);

    // TODO websocket
    // var message = wsResponses.message('gameFound', {gameId: game.id});
    // GameApplication.message(gameApplication.id, message)
    // if (gameApplicationSub) GameApplication.message(gameApplicationSub.id, message)

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

    return true;
    /* eslint-enable no-param-reassign */
  }

  async gameApplicationExpired({ gameApplication, gameApplications, index }) {
    /* eslint-disable no-param-reassign */
    await gameApplication.destroy();

    gameApplications.splice(index, 1);
    index -= 1;

    // TODO websocket
    // GameApplication.message(
    //   gameApplication.id,wsResponses.message('gameApplicationExpired')
    // );
    /* eslint-enable no-param-reassign */
  }

  async gameApplicationIteration({ gameApplications, index = 0, db }) {
    /* eslint-disable no-param-reassign */
    const gameApplication = gameApplications[index];

    if (!gameApplication) {
      return true;
    }

    gameApplication.residueTime -= gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT;

    if (gameApplication.residueTime < 0) {
      this.gameApplicationExpired({ gameApplication, gameApplications, index });
    } else {
      await gameApplication.save();

      const specialIterationFn = !gameApplication.isEstimator ?
      this.iterationForPlayer :
      this.iterationForEstimator;

      await specialIterationFn.call(this, { gameApplication, gameApplications, index, db });
    }

    return this.gameApplicationIteration({ gameApplications, index: index + 1, db });
    /* eslint-enable no-param-reassign */
  }

  async interval({ db }) {
    const gameApplications = await db.GameApplication.findAll();

    const result = await this.gameApplicationIteration({ gameApplications, db });

    return result;
  }
}
