import schedule from 'node-schedule';
import express from 'express';
import WebSocket from 'ws';
import db, { dbConnection } from './helpers/db';
import routes from './routes';
import socketEvents from './socket-events';
import gameConfig from './game-config';
import GameCtrl from './controllers/game';
import ApplicationConnect from './controllers/applications-connect';
import WS from './helpers/ws';

const app = express();

const wsServer = new WebSocket.Server({
  perMessageDeflate: false,
  port: 3001,
});

const ws = new WS(wsServer, db);

const applicationConnect = new ApplicationConnect(db, ws, new GameCtrl(db, ws));

schedule.scheduleJob(
  `*/${gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT} * * * * *`,
  async () => {
    try {
      await applicationConnect.interval();
    } catch (err) {
      console.error(err);
    }
  },
);

socketEvents(ws, db);
routes(app, db);

dbConnection.sync().then(() => {
  console.log('sunc success');
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
