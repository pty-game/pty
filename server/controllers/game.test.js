import Sequelize from 'sequelize';
import models from '../models';
import { subscribe, unsubscribe, addAction, create } from './game';
import { mockUser, mockGameUser, mockGame, mockTask } from '../mocks';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

let users = [];
let gameUsers = [];
const gameActions = [];
const games = [];
let tasks = [];

beforeAll(async () => {
  users = [
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
  ];

  games.push(await db.Game.create(mockGame()));

  gameUsers = [
    await db.GameUser.create(mockGameUser(users[0].id, games[0].id)),
    await db.GameUser.create(mockGameUser(users[1].id, games[0].id)),
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
});

describe('game', () => {
  it('subscribe', async () => {
    try {
      const gameId = games[0].id;

      const result = await subscribe({ userId: users[0].id, gameId }, db);
      expect(result.id).toBe(gameId);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('unsubscribe', async () => {
    try {
      const gameId = games[0].id;

      const result = await unsubscribe({ userId: users[0].id, gameId }, db);
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

      const result = await addAction({
        userId,
        gameId,
        action: { someAction: 'someAction' },
      }, db);

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
      const result = await create({}, db);
      games.push(result);

      expect(typeof result.id).toBe('number');
      expect(typeof result.taskId).toBe('number');
    } catch (err) {
      throw new Error(err.stack);
    }
  });
});
