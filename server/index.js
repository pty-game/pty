import { CronJob } from 'cron';
import express from 'express';
import WebSocket from 'ws';
import Sequelize from 'sequelize';
import models from './models';
import routes from './routes';
import socketEvents from './socket-events';
import gameConfig from './game-config';
import GameCtrl from './controllers/game';
import ApplicationConnect from './controllers/applications-connect';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

const applicationConnect = new ApplicationConnect(db, new GameCtrl(db), gameConfig);
const app = express();

const wsServer = new WebSocket.Server({
  perMessageDeflate: false,
  port: 3001,
});

wsServer.on('connection', (socket) => {
  socketEvents(socket);
});

routes(app, db);

CronJob(`*/${gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT} * * * * *`, applicationConnect.interval);

sequelize.sync().then(() => {
  console.log('sunc success');
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
