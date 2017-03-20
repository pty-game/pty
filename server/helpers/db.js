import Sequelize from 'sequelize';
import models from '../models';

export const dbConnection = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const db = models(dbConnection);

export default db;
