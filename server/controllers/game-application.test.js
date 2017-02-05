import Sequelize from 'sequelize';
import models from '../models';
import { gameApplicationCreate } from './game-application';
import { mockUser } from '../mocks';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

let user;
let gameApplication;

beforeAll(async () => {
  user = await db.User.create(mockUser());
});

afterAll(async () => {
  await db.User.destroy({ where: { id: user.id } });
  await db.GameApplication.destroy({ where: { id: gameApplication.id } });
});

describe('game application', () => {
  it('create', async () => {
    gameApplication = await gameApplicationCreate({ userId: user.id }, db);

    expect(gameApplication.userId).toBe(user.id);
    expect(gameApplication.isBot).toBe(false);
    expect(gameApplication.isEstimator).toBe(false);
  });
});
