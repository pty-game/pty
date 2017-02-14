import _ from 'lodash';
import { generateGameWonExperienceFromLevel } from '../helpers';
import * as gameConfig from '../game-config';
import { estimatorAction } from '../../common/actions';

export default class GameCtrl {
  async subscribe({ userId, gameId, db }) {
    const game = await db.Game.find({
      where: { id: gameId },
      include: [db.GameUser],
    });

    const isUserInThisGame = game.gameUsers.find((gameUser) => {
      return gameUser.userId === userId;
    });

    if (!isUserInThisGame) {
      throw new Error('User is not in this game');
    }
    // TODO socket
    // db.Game.subscribe(req, game);

    return game;
  }

  async unsubscribe({ gameId, db }) {
    const game = await db.Game.findOne({ where: { id: gameId } });
    // TODO socket
    // db.Game.unsubscribe(req, game);

    return game;
  }

  async addUserAction({ userId, gameId, action, db }) {
    const gameUser = await db.GameUser.find({ where: { userId, gameId, isBot: false } });

    if (!gameUser) {
      throw new Error('This GameUser is not allowed for this game');
    }

    const gameAction = await this.addAction({
      action,
      gameId,
      gameUserId: gameUser.id,
      db,
    });

    return gameAction;
  }

  async addAction({ gameId, gameUserId, action, db }) {
    const game = db.Game.find({ where: { id: gameId } });

    if (game.residueTime <= 0) {
      throw new Error('This Game is finished');
    }

    const gameAction = await db.GameAction.create({
      action,
      gameId,
      gameUserId,
    });

    // TODO socket
    // Game.message(this.id, wsResponses.message('actionAdded', gameAction), req || null);

    return gameAction;
  }

  async getGameWinnerGameUserId({ game, db }) {
    if (this.residueTime) throw new Error('This game does not finished yet');

    const gameActions = await db.GameAction.findAll({
      where: { gameId: game.id },
      include: [db.GameUser],
      order: [['updatedAt', 'DESC']],
    });

    const estimatorsGameActions = gameActions.filter((estimatorsGameAction) => {
      return estimatorsGameAction.gameUser.isEstimator;
    });

    const uniqEstimatorsGameActions = _.uniqBy(estimatorsGameActions, 'gameUserId');

    const uniqEstimatorsGameActionsByGameUserId = _.groupBy(uniqEstimatorsGameActions, 'action.gameUserId');

    const results = {};

    Object.keys(uniqEstimatorsGameActionsByGameUserId).forEach((gameUserId) => {
      results[gameUserId] = uniqEstimatorsGameActionsByGameUserId[gameUserId].length;
    });

    const isDraw = !_.uniq(Object.values(results)).length;

    if (isDraw) return null;

    const gameUserIds = [];
    const votes = [];

    Object.keys(results).forEach((gameUserId) => {
      votes.push(results[gameUserId]);
      gameUserIds.push(gameUserId);
    });

    const maxVotes = Math.max.apply(null, votes);
    const indexOfMaxVotes = votes.indexOf(maxVotes);

    return parseInt(gameUserIds[indexOfMaxVotes], 10);
  }

  async finishGame({ game, db }) {
    const gameWinnerGameUserId = await this.getGameWinnerGameUserId({ game, db });

    const gameUsers = game.gameUsers || await game.getGameUsers();

    const gameUsersPlayers = gameUsers.filter((gameUser) => {
      return gameUser.isBot === false && gameUser.isEstimator === false;
    });

    const usersPromises = await gameUsers.map((gameUser) => {
      return db.User.find({ where: { id: gameUser.userId } });
    });

    const users = await Promise.all(usersPromises);
    let gameWinnerUser = null;

    if (gameWinnerGameUserId) {
      const gameWinnerGameUserIndex = gameUsersPlayers.findIndex((gameUsersPlayer) => {
        return gameUsersPlayer.id === gameWinnerGameUserId;
      });

      gameWinnerUser = users[gameWinnerGameUserIndex];
    }

    /* eslint-disable no-param-reassign */
    const updatedUsersPromises = users.map((user) => {
      user.gamesTotal += 1;

      if (gameWinnerUser) {
        if (gameWinnerUser.id === user.id) {
          user.experience += generateGameWonExperienceFromLevel(user.level);
          user.gamesWon += 1;
        } else {
          user.gamesLose += 1;
        }
      } else {
        user.gamesDraw += 1;
      }
      // TODO socket
      // User.message(user.id, wsResponses.message('data', {user: user}));

      return user.save();
    });

    const updatedUsers = await Promise.all(updatedUsersPromises);
    /* eslint-enable no-param-reassign */

    // TODO socket
    // db.Game.message(
    //  game.id,
    //  wsResponses.message('finishGame', {gameWinnerGameUserId: gameWinnerGameUserId}));

    return { game, users: updatedUsers };
  }

  async timeIntervalIteration(
    {
      gameTimeIntervalObj: { intervalId },
      gameId,
      db,
    },
  ) {
    const game = await db.Game.find({
      where: { id: gameId },
      include: [db.GameUser],
    });

    if (!game) {
      return clearInterval(intervalId);
    }

    game.residueTime -= 1;

    await game.save();

    if (game.residueTime <= 0) {
      clearInterval(intervalId);

      await this.finishGame({ game, db });
    } else {
      const isEstimatorsPresent = await game.isEstimatorsPresent(game);

      if (
        game.residueTime <= gameConfig.RESIDUE_TIME_FOR_ESTIMATOR_BOTS &&
        game.residueTime >= 1 &&
        !isEstimatorsPresent
      ) {
        db.GameUser.createBotForGame({ game, isEstimator: true, db });
      }

      // TODO
      // db.Game.message(
      //   game.id,
      //   wsResponses.message('residueTime', { residueTime: game.residueTime }),
      // );
    }

    return true;
  }

  async createBotForGame({ game, isEstimator, gameApplicationUserId, db }) {
    let bot;

    if (isEstimator) {
      bot = await db.GameUser.create({
        isEstimator: true,
        isBot: true,
        game: game.id,
      });

      const playersGameUsers = game.gameUsers.filter(() => {
        return isEstimator === false;
      });

      const randomPlayerIndex = this.getRandomIntInRange(0, playersGameUsers.length);

      this.addAction({
        gameUserId: bot.id,
        gameId: game.id,
        action: estimatorAction(randomPlayerIndex),
        db,
      });
    } else {
      const gamesWithSameTask = await db.Game.find({
        where: {
          task: game.task,
          id: {
            $not: game.id,
          },
        },
        include: [db.GameUser],
      });

      const gamesWithSameTaskWithoutCurrentUsers = gamesWithSameTask.filter((gameWithSameTask) => {
        return !gameWithSameTask.gameUsers.find((gameUser) => {
          return gameUser.userId === gameApplicationUserId && gameUser.isBot === false;
        });
      });

      if (!gamesWithSameTaskWithoutCurrentUsers.length) {
        throw new Error('Game without this users is not found');
      }

      const gameWithSameTaskWithoutCurrentUsers = _.sample(gamesWithSameTask);

      const gameUsersWithSameTask = gameWithSameTaskWithoutCurrentUsers.gameUsers
      .find((gameUser) => {
        return gameUser.isEstimator === false && gameUser.isBot === false;
      });

      if (!gameUsersWithSameTask.length) {
        throw new Error('GameUser with the same task is not found');
      }

      const gameUserWithSameTask = _.sample(gameUsersWithSameTask);

      const gameUserActionsWithSameTask = await gameUserWithSameTask.getGameActions();

      bot = await db.GameUser.create({
        isEstimator: false,
        isBot: true,
        gameId: game.id,
        userId: gameUserWithSameTask.userId,
      });

      this.gameActionsEmulator({ gameId: game.id, gameActions: gameUserActionsWithSameTask, db });
    }

    return bot;
  }

  async gameActionsEmulator({
    gameId,
    gameActions,
    date,
    index = 0,
    db,
    newActions = [],
  }) {
    const gameAction = gameActions[index];
    const timeout = date ?
      new Date(gameAction.createdAt).getTime() - new Date(date).getTime() :
      0;

    let resolve;
    const promise = new Promise((_resolve) => {
      resolve = _resolve;
    });

    setTimeout(async () => {
      const actionPromise = await this.addAction({
        gameUserId: gameAction.gameUserId,
        gameId,
        action: gameAction.action,
        db,
      });

      resolve.call(promise, actionPromise);
    }, timeout);

    const action = await promise;

    newActions.push(action);

    if (index + 1 < gameActions.length) {
      return this.gameActionsEmulator({
        gameId,
        gameActions,
        date,
        index: index + 1,
        db,
        newActions,
      });
    }

    return newActions;
  }

  async isEstimatorsPresent(game) {
    let gameUsers;

    if (!game.gameUsers) {
      gameUsers = await game.getGameUsers();
    } else {
      gameUsers = game.gameUsers;
    }

    return !!gameUsers.find((gameUser) => {
      return gameUser.isEstimator && !gameUser.isBot;
    });
  }

  async create({ db }) {
    const tasks = await db.Task.findAll();

    const taskId = tasks[Math.floor(Math.random() * tasks.length)].id;

    const game = await db.Game.create({ taskId });

    // Object for provide interval id by link
    const gameTimeIntervalObj = {};

    gameTimeIntervalObj.itervalId = setInterval(
      this.timeIntervalIteration.bind(this, { gameTimeIntervalObj }, db),
      1000,
    );

    return game;
  }
}
