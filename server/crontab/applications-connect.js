import gameConfig from '../game-config';
import GameCtrl from '../controllers/game';

const gameCtrl = new GameCtrl();

export default class ApplicationConnect {
  async gameApplicationIteration({ gameApplications, index = 0, db }) {
    /* eslint-disable no-param-reassign */
    const gameApplication = gameApplications[index];

    if (!gameApplication) {
      return true;
    }

    gameApplication.residueTime -= gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT;

    if (gameApplication.residueTime < 0) {
      await gameApplication.destroy();

      gameApplications.splice(index, 1);
      index -= 1;

      // TODO websocket
      // GameApplication.message(
      //   gameApplication.id,wsResponses.message('gameApplicationExpired')
      // );

      return this.gameApplicationIteration({ gameApplications, index: index + 1, db });
    }

    await gameApplication.save();

    if (!gameApplication.isEstimator) {
      const gameApplicationSub = this.findOpponentForPlayer(gameApplication, gameApplications);

      if (
        !gameApplicationSub &&
        gameApplication.residueTime > gameConfig.RESIDUE_TIME_FOR_PAINTER_BOTS
      ) {
        return this.gameApplicationIteration({ gameApplications, index: index + 1, db });
      }

      const game = await gameCtrl.create();
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
        }

        return this.gameApplicationIteration({ gameApplications, index: index + 1, db });
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
    } else {
      const gameWithMinEstimators = await gameCtrl.findWithMinEstimators({
        finderUserId: gameApplication.userId,
        db,
      });

      if (!gameWithMinEstimators) {
        return this.gameApplicationIteration({ gameApplications, index: index + 1, db });
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

      gameApplication.destroy();
    }

    return this.gameApplicationIteration({ gameApplications, index: index + 1, db });
    /* eslint-enable no-param-reassign */
  }

  async interval({ db }) {
    const gameApplications = await db.GameApplication.findAll();

    await this.gameApplicationIteration({ gameApplications, db });
  }
}
