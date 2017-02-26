import Sequelize from 'sequelize';
import models from '../models';
import gameConfig from '../game-config';
import ApplicationsConnect from './applications-connect';
import { mockUser, mockGameApplication, mockGameUser, mockGame, mockTask } from '../mocks';

const applicationsConnect = new ApplicationsConnect();

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

let users = [];
let gameApplications = [];
let games = [];
let gameUsers = [];
let tasks = [];

beforeAll(async () => {
  tasks = [
    await db.Task.create(mockTask()),
    await db.Task.create(mockTask()),
  ];
  users = [
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
    await db.User.create(mockUser()),
  ];

  games = [
    await db.Game.create(mockGame()),
    await db.Game.create(mockGame()),
  ];

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

  gameApplications = [
    await db.GameApplication.create(mockGameApplication({
      userId: users[0].id,
      isEstimator: false,
    })),
    await db.GameApplication.create(mockGameApplication({
      userId: users[1].id,
      isEstimator: false,
    })),
    await db.GameApplication.create(mockGameApplication({
      userId: users[2].id,
      isEstimator: false,
    })),
    await db.GameApplication.create(mockGameApplication({
      userId: users[3].id,
      isEstimator: false,
    })),
    await db.GameApplication.create(mockGameApplication({
      userId: users[4].id,
      isEstimator: true,
    })),
    await db.GameApplication.create(mockGameApplication({
      userId: users[5].id,
      isEstimator: true,
    })),
    await db.GameApplication.create(mockGameApplication({
      userId: users[6].id,
      isEstimator: true,
    })),
  ];
});

afterAll(async () => {
  await tasks.map((item) => {
    return item.destroy();
  });
  await games.map((item) => {
    return item.destroy();
  });
  await users.map((item) => {
    return item.destroy();
  });
  await gameUsers.map((item) => {
    return item.destroy();
  });
  await gameApplications.map((item) => {
    return item.destroy();
  });
});

describe('applications connect', () => {
  it('findOpponentForPlayer', async () => {
    try {
      const opponentForPlayer = await applicationsConnect.findOpponentForPlayer({
        gameApplication: gameApplications[0],
        gameApplications,
      });
      expect(opponentForPlayer.id).toBe(gameApplications[1].id);
    } catch (err) {
      throw new Error(err.stack);
    }
  });
});

describe('applications connect', () => {
  it('iterationForEstimator', async () => {
    try {
      const result = await applicationsConnect.iterationForEstimator({
        gameApplication: gameApplications[4],
        db,
      });
      expect(
        result.gameUsers.filter((gameUser) => {
          return gameUser.isEstimator;
        }).length,
      ).toBe(0);
    } catch (err) {
      throw new Error(err.stack);
    }
  });
  it('iterationForPlayer', async () => {
    try {
      const result = await applicationsConnect.iterationForPlayer({
        gameApplication: gameApplications[4],
        gameApplications,
        index: 0,
        db,
      });
      expect(result.residueTime).toBe(gameConfig.GAME_DURATION);
    } catch (err) {
      throw new Error(err.stack);
    }
  });
  it('interval', async () => {
    try {
      const result = await applicationsConnect.interval({ db });
      expect(result).toBe(true);
    } catch (err) {
      throw new Error(err.stack);
    }
  });
});
