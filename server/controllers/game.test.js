import Sequelize from 'sequelize';
import models from '../models';
import { subscribe, unsubscribe, addAction } from './game';
import { mockUser, mockGameUser, mockGame } from '../mocks';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

let users = [];
let gameUsers = [];
let game = {};

beforeAll(async () => {
  users = [
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
  ];

  game = await db.Game.create(mockGame());

  gameUsers = [
    await db.GameUser.create(mockGameUser(users[0].id, game.id)),
    await db.GameUser.create(mockGameUser(users[1].id, game.id)),
  ];
});

afterAll(async () => {
  await users.map((user) => {
    return user.destroy();
  });

  await gameUsers.map((gameUser) => {
    return gameUser.destroy();
  });

  await game.destroy();
});

describe('game', () => {
  it('subscribe', async () => {
    try {
      const result = await subscribe({ userId: users[0].id, gameId: game.id }, db);
      expect(result.id).toBe(game.id);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('unsubscribe', async () => {
    try {
      const result = await unsubscribe({ userId: users[0].id, gameId: game.id }, db);
      expect(result.id).toBe(game.id);
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  it('addAction', async () => {
    try {
      const userId = users[0].id;
      const gameUserId = gameUsers[0].id;
      const gameId = game.id;

      const result = await addAction({
        userId,
        gameId,
        action: { someAction: 'someAction' },
      }, db);

      expect(result.gameId).toBe(gameId);
      expect(result.gameUserId).toBe(gameUserId);
      expect(result.action.someAction).toBe('someAction');
    } catch (err) {
      throw new Error(err.stack);
    }
  });
});
