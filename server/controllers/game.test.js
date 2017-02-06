import Sequelize from 'sequelize';
import models from '../models';
import { gameSubscribe } from './game';
import { mockUsersFactory, mockGameUser, mockGame } from '../mocks';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

let users = [];
let gameUsers = [];
let game = {};

beforeAll(async () => {
  users = await db.User.bulkCreate(mockUsersFactory(2));
  game = await db.Game.create(mockGame());
  gameUsers = await db.GameUser.bulkCreate([
    mockGameUser(users[0].id, game.id),
    mockGameUser(users[1].id, game.id),
  ]);
});

afterAll(async () => {
  await users.map((user) => {
    return user.destroy;
  });

  await gameUsers.map((gameUser) => {
    return gameUser.destroy;
  });

  await game.destroy();
});

describe('game', () => {
  it('subscribe', async () => {
    try {
      const result = await gameSubscribe({ userId: users[0].id, gameId: game.id }, db);
      expect(result.id).toBe(game.id);
    } catch (err) {
      throw new Error(err.stack);
    }
  });
});
