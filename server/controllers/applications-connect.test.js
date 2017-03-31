import gameConfig from '../game-config';
import ApplicationsConnect from './applications-connect';
import GameCtrl from '../controllers/game';
import { mockUser, mockGameApplication, mockGameUser, mockGame, mockTask, mockWs } from '../mocks';
import db from '../helpers/db';

const applicationsConnect = new ApplicationsConnect(db, mockWs(), new GameCtrl(db));

let users = [];
let gameApplications = [];
let games = [];
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

  await db.GameUser.create(mockGameUser(users[0].id, games[0].id));
  await db.GameUser.create(mockGameUser(users[1].id, games[0].id));
  await db.GameUser.create(mockGameUser(users[2].id, games[0].id, true));
  await db.GameUser.create(mockGameUser(users[3].id, games[0].id, true));
  await db.GameUser.create(mockGameUser(users[4].id, games[0].id, true));

  // game without estimators
  await db.GameUser.create(mockGameUser(users[5].id, games[1].id));
  await db.GameUser.create(mockGameUser(users[6].id, games[1].id));

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

  const allGames = await db.Game.findAll();

  await Promise.all(allGames.map((item) => {
    return item.destroy();
  }));

  const allGameUsers = await db.GameUser.findAll();

  await Promise.all(allGameUsers.map((item) => {
    return item.destroy();
  }));

  await users.map((item) => {
    return item.destroy();
  });

  const allGameApplications = await db.GameApplication.findAll();

  await Promise.all(allGameApplications.map((item) => {
    return item.destroy();
  }));
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
      const { game, createdGameUsers } = await applicationsConnect.iterationForEstimator({
        gameApplication: gameApplications[4],
        gameApplications,
        db,
      });

      games.push(game);

      expect(typeof game.id).toBe('number');

      expect(
        game.gameUsers.filter((gameUser) => {
          return gameUser.isEstimator;
        }).length,
      ).toBe(0);

      expect(
        createdGameUsers.filter((gameUser) => {
          return gameUser.isEstimator;
        }).length,
      ).toBe(1);

      const userIds = game.gameUsers.map((gameUser) => {
        return gameUser.userId;
      });
      expect(typeof userIds[0]).toBe('number');
      expect(typeof userIds[1]).toBe('number');
    } catch (err) {
      throw new Error(err.stack);
    }
  });
  it('iterationForPlayer', async () => {
    try {
      const { game, createdGameUsers } = await applicationsConnect.iterationForPlayer({
        gameApplication: gameApplications[4],
        gameApplications,
        index: 0,
        db,
      });

      games.push(game);

      expect(game.residueTime).toBe(gameConfig.GAME_DURATION);
      expect(
        createdGameUsers.filter((gameUser) => {
          return gameUser.isEstimator;
        }).length,
      ).toBe(0);
      expect(
        createdGameUsers.filter((gameUser) => {
          return !gameUser.isEstimator;
        }).length,
      ).toBe(2);

      const userIds = createdGameUsers.map((gameUser) => {
        return gameUser.userId;
      });

      expect(typeof userIds[0]).toBe('number');
      expect(typeof userIds[1]).toBe('number');
    } catch (err) {
      throw new Error(err.stack);
    }
  });
  it('gameApplicationIteration', async () => {
    try {
      const result = await applicationsConnect.gameApplicationIteration({ gameApplications });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(typeof result.find(({ game: { dataValues: { actions } } }) => {
        return Array.isArray(actions);
      })).toBe('object');
    } catch (err) {
      throw new Error(err.stack);
    }
  });

  // it('interval', async () => {
  //   try {
  //     const result = await applicationsConnect.interval();
  //     expect(Array.isArray(result)).toBe(true);
  //   } catch (err) {
  //     throw new Error(err.stack);
  //   }
  // });
});
