import _ from 'lodash';
import { estimatorAction } from 'pty-common/actions';
import gameConfig from '../game-config';
import { generateGameWonExperienceFromLevel } from '../helpers/experience';

export default class GameCtrl {
  constructor(db, ws) {
    this.db = db;
    this.ws = ws;
  }

  async addUserAction({ userId, gameId, action }) {
    const gameUser = await this.db.GameUser.find({ where: { userId, gameId, isBot: false } });
    if (!gameUser) {
      throw new Error('This GameUser is not allowed for this game');
    }
    const gameAction = await this.addAction({
      action,
      gameId,
      userId,
      gameUserId: gameUser.id,
    });

    return gameAction;
  }

  async addAction({
    gameId,
    // userId,
    gameUserId,
    action,
  }) {
    const game = await this.db.Game.find({
      where: { id: gameId },
      include: [this.db.GameUser],
    });

    if (game.residueTime <= 0) {
      throw new Error('This Game is finished');
    }

    const gameAction = await this.db.GameAction.create({
      action,
      gameId,
      gameUserId,
    });

    const userIds = game.gameUsers.map((gameUser) => {
      return gameUser.userId;
    });

    // const userIdsWithoutCurrentUser = userIds.filter((item) => {
    //   return item !== userId;
    // });

    this.ws.send(userIds, 'GAME_ACTION_ADDED', gameAction);

    return gameAction;
  }

  async getGameWinnerGameUserId({ game }) {
    if (this.residueTime) throw new Error('This game does not finished yet');

    const gameActions = await this.db.GameAction.findAll({
      where: { gameId: game.id },
      include: [this.db.GameUser],
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

  async finishGame({ game }) {
    const winnerGameUserId = await this.getGameWinnerGameUserId({ game });

    const gameUsers = game.gameUsers || await game.getGameUsers();

    const gameUsersPlayers = gameUsers.filter((gameUser) => {
      return gameUser.isBot === false && gameUser.isEstimator === false;
    });

    const usersPromises = await gameUsers.map((gameUser) => {
      return this.db.User.find({ where: { id: gameUser.userId } });
    });

    const users = await Promise.all(usersPromises);
    let gameWinnerUser = null;

    if (winnerGameUserId) {
      const gameWinnerGameUserIndex = gameUsersPlayers.findIndex((gameUsersPlayer) => {
        return gameUsersPlayer.id === winnerGameUserId;
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

      this.ws.send(user.id, 'USER_DATA', { user });

      return user.save();
    });

    const updatedUsers = await Promise.all(updatedUsersPromises);
    /* eslint-enable no-param-reassign */

    const userIds = gameUsers.map((gameUser) => {
      return gameUser.userId;
    });

    this.ws.send(
     userIds,
     'GAME_FINISHED',
     { gameWinnerUserId: gameWinnerUser.id, gameId: game.id },
   );

    return { game, users: updatedUsers };
  }

  async timeIntervalIteration({
    intervalId,
    gameId,
  }) {
    const game = await this.db.Game.find({
      where: { id: gameId },
      include: [this.db.GameUser],
    });

    if (!game) {
      clearInterval(intervalId);

      throw new Error('This Game is not exist');
    }

    game.residueTime -= 1;

    await game.save();

    if (game.residueTime <= 0) {
      clearInterval(intervalId);

      await this.finishGame({ game });
    } else {
      const isEstimatorsPresent = await this.isEstimatorsPresent(game);

      if (
        game.residueTime <= gameConfig.RESIDUE_TIME_FOR_ESTIMATOR_BOTS &&
        game.residueTime >= 1 &&
        !isEstimatorsPresent
      ) {
        await this.createBotForGame({ game, isEstimator: true });
      }

      const userIds = game.gameUsers.map((gameUser) => {
        return gameUser.userId;
      });

      this.ws.send(
        userIds,
        'GAME_RESIDUE_TIME',
        { residueTime: game.residueTime, gameId: game.id },
      );
    }

    return true;
  }

  async createBotForGame({ game, isEstimator, gameApplicationUserId }) {
    let bot;

    if (isEstimator) {
      bot = await this.db.GameUser.create({
        isEstimator: true,
        isBot: true,
        game: game.id,
      });

      const gameUsers = await game.getGameUsers();

      const playersGameUsers = gameUsers.filter((gameUser) => {
        return gameUser.isEstimator === false;
      });

      const randomPlayerIndex = _.random(0, playersGameUsers.length - 1);

      await this.addAction({
        gameUserId: bot.id,
        gameId: game.id,
        action: estimatorAction(playersGameUsers[randomPlayerIndex].id),
      });
    } else {
      const gamesWithSameTask = await this.db.Game.findAll({
        where: {
          taskId: game.taskId,
          id: {
            $not: game.id,
          },
        },
        include: [this.db.GameUser],
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

      bot = await this.db.GameUser.create({
        isEstimator: false,
        isBot: true,
        gameId: game.id,
        userId: gameUserWithSameTask.userId,
      });

      this.gameActionsEmulator({ gameId: game.id, gameActions: gameUserActionsWithSameTask });
    }

    return bot;
  }

  async gameActionsEmulator({
    gameId,
    gameActions,
    date,
    index = 0,
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
      try {
        const actionPromise = await this.addAction({
          gameUserId: gameAction.gameUserId,
          gameId,
          action: gameAction.action,
        });

        resolve.call(promise, actionPromise);
      } catch (err) {
        console.error(err);
      }
    }, timeout);

    const action = await promise;

    newActions.push(action);

    if (index + 1 < gameActions.length) {
      return this.gameActionsEmulator({
        gameId,
        gameActions,
        date,
        index: index + 1,
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

  async create() {
    const tasks = await this.db.Task.findAll();

    const task = _.sample(tasks);

    const game = await this.db.Game.create({ taskId: task ? task.id : null });

    return game;
  }

  async start({ gameId }) {
    const intervalId = setInterval(async () => {
      try {
        await this.timeIntervalIteration({
          intervalId,
          gameId,
        });
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  }

  async findWithMinEstimators({ finderUserId }) {
    const games = await this.db.Game.findAll({ include: [this.db.GameUser] });
    const filteredGames = games.filter((game) => {
      return !(
        game.gameUsers.find((gameUser) => {
          return !gameUser.isBot && gameUser.userId === finderUserId;
        }) ||
        game.residueTime <= gameConfig.RESIDUE_TIME_TRESHOLD_FOR_GAME_SEARCH
      );
    });

    return filteredGames.sort((a, b) => {
      return a.gameUsers.length - b.gameUsers.length;
    })[0];
  }
}
