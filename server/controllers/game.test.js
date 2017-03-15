import Sequelize from 'sequelize';
import models from '../models';
import GameCtrl from './game';
import gameConfig from '../game-config';
import { generateGameWonExperienceFromLevel } from '../helpers';
import { mockUser, mockGameUser, mockGame, mockTask, mockGameAction } from '../mocks';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

const gameCtrl = new GameCtrl(db, gameConfig, generateGameWonExperienceFromLevel);

let users = [];
let gameUsers = [];
let gameActions = [];
const games = [];
let tasks = [];

beforeAll(async () => {
  users = [
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
  ];

  games.push(await db.Game.create(mockGame()));
  games.push(await db.Game.create(mockGame()));

  gameUsers = [
    await db.GameUser.create(mockGameUser(users[0].id, games[0].id)),
    await db.GameUser.create(mockGameUser(users[1].id, games[0].id)),
    await db.GameUser.create(mockGameUser(users[2].id, games[0].id, true)),
    await db.GameUser.create(mockGameUser(users[3].id, games[0].id, true)),
    await db.GameUser.create(mockGameUser(users[4].id, games[0].id, true)),

    // game without estimators
    await db.GameUser.create(mockGameUser(users[5].id, games[1].id)),
    await db.GameUser.create(mockGameUser(users[6].id, games[1].id)),
  ];

  gameActions = [
    await db.GameAction.create(mockGameAction(gameUsers[0].id, games[0].id)),
    await db.GameAction.create(mockGameAction(gameUsers[1].id, games[0].id)),
    await db.GameAction.create(mockGameAction(gameUsers[2].id, games[0].id, {
      gameUserId: gameUsers[0].id,
    })),
    await db.GameAction.create(mockGameAction(gameUsers[3].id, games[0].id, {
      gameUserId: gameUsers[1].id,
    })),
    await db.GameAction.create(mockGameAction(gameUsers[4].id, games[0].id, {
      gameUserId: gameUsers[1].id,
    })),
    await db.GameAction.create(mockGameAction(gameUsers[4].id, games[0].id, {
      gameUserId: gameUsers[0].id,
    })),
    await db.GameAction.create(mockGameAction(gameUsers[4].id, games[0].id, {
      gameUserId: gameUsers[1].id,
    })),
  ];

  tasks = [
    await db.Task.create(mockTask()),
    await db.Task.create(mockTask()),
  ];
});

afterAll(async () => {
  await users.map((user) => {
    return user.destroy();
  });

  await gameUsers.map((gameUser) => {
    return gameUser.destroy();
  });

  await games.map((game) => {
    return game.destroy();
  });

  await tasks.map((task) => {
    return task.destroy();
  });

  await gameActions.map((gameAction) => {
    return gameAction.destroy();
  });
});

describe('game', () => {
  it('subscribe', async () => {
    try {
      const gameId = games[0].id;

      const result = await gameCtrl.subscribe({ userId: users[0].id, gameId, db });
      expect(result.id).toBe(gameId);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('unsubscribe', async () => {
    try {
      const gameId = games[0].id;

      const result = await gameCtrl.unsubscribe({ userId: users[0].id, gameId, db });
      expect(result.id).toBe(gameId);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('addUserAction', async () => {
    try {
      const userId = users[0].id;
      const gameUserId = gameUsers[0].id;
      const gameId = games[0].id;

      const result = await gameCtrl.addUserAction({
        userId,
        gameId,
        action: { someAction: 'someAction' },
        db,
      });

      gameActions.push(result);

      expect(result.gameId).toBe(gameId);
      expect(result.gameUserId).toBe(gameUserId);
      expect(result.action.someAction).toBe('someAction');
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('create', async () => {
    try {
      const result = await gameCtrl.create({ db });
      games.push(result);

      expect(typeof result.id).toBe('number');
      expect(typeof result.taskId).toBe('number');
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('getGameWinnerGameUserId', async () => {
    try {
      const result = await gameCtrl.getGameWinnerGameUserId({ game: games[0], db });

      expect(result).toBe(gameUsers[1].id);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('isEstimatorsPresent', async () => {
    try {
      expect(await gameCtrl.isEstimatorsPresent(games[0])).toBe(true);
      expect(await gameCtrl.isEstimatorsPresent(games[1])).toBe(false);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('gameActionsEmulator', async () => {
    try {
      const gameActionsPart = gameActions.slice(0, 2);

      const result = await gameCtrl.gameActionsEmulator({
        gameId: games[1].id,
        gameActions: gameActionsPart,
        db,
      });

      gameActions = gameActions.concat(result);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(gameActionsPart.length);
      expect(JSON.stringify(result[0].action)).toBe(JSON.stringify(gameActionsPart[0].action));
      expect(result[0].gameId).not.toBe(gameActionsPart[0].gameId);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('finishGame', async () => {
    try {
      const initWonUserGamesWon = users[1].gamesWon;
      const game = games[0];

      const result = await gameCtrl.finishGame({ game, db });

      expect(result.game.id).toBe(game.id);
      expect(result.users[0].id).toBe(users[0].id);
      expect(result.users[1].gamesWon).toBe(initWonUserGamesWon + 1);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('timeIntervalIteration', async () => {
    try {
      const gameId = games[0].id;

      const intervalId = setInterval(() => {});

      const result = await gameCtrl.timeIntervalIteration({ gameId, intervalId, db });

      expect(result).toBe(true);
    } catch (err) {
      throw new Error(err.stack);
    }
  });
});
