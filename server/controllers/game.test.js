import Sequelize from 'sequelize';
import models from '../models';
import GameCtrl from './game';
import { mockUser, mockGameUser, mockGame, mockTask, mockGameAction } from '../mocks';

const gameCtrl = new GameCtrl();

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

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
  ];

  games.push(await db.Game.create(mockGame()));

  gameUsers = [
    await db.GameUser.create(mockGameUser(users[0].id, games[0].id)),
    await db.GameUser.create(mockGameUser(users[1].id, games[0].id)),
    await db.GameUser.create(mockGameUser(users[2].id, games[0].id, true)),
    await db.GameUser.create(mockGameUser(users[3].id, games[0].id, true)),
    await db.GameUser.create(mockGameUser(users[4].id, games[0].id, true)),
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
    await db.GameUser.create(mockTask()),
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

      const result = await gameCtrl.subscribe({}, { userId: users[0].id, gameId, db });
      expect(result.id).toBe(gameId);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('unsubscribe', async () => {
    try {
      const gameId = games[0].id;

      const result = await gameCtrl.unsubscribe({}, { userId: users[0].id, gameId, db });
      expect(result.id).toBe(gameId);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('addAction', async () => {
    try {
      const userId = users[0].id;
      const gameUserId = gameUsers[0].id;
      const gameId = games[0].id;

      const result = await gameCtrl.addAction({}, {
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
      const result = await gameCtrl.create({}, { db });
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
});
