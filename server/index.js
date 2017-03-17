import { CronJob } from 'cron';
import express from 'express';
import Sequelize from 'sequelize';
import socketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';
import models from './models';
import routes from './routes';
import socketEvents from './socket-events';
import gameConfig from './game-config';
import config from './config';
import GameCtrl from './controllers/game';
import ApplicationConnect from './controllers/applications-connect';

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

const applicationConnect = new ApplicationConnect(db, new GameCtrl(db), gameConfig);
const app = express();
const io = socketIO(3001);

io.use(socketioJwt.authorize({
  secret: config.JWT_SECRET,
  handshake: true,
}));

io.on('connection', (socket) => {
  console.log('Client connected!!!!!');
  socketEvents(socket);

  socket.emit('subscribed', socket.decoded_token)
});

routes(app, db);

CronJob(`*/${gameConfig.GAME_APPLICATION_CRONTAB_TIMEOUT} * * * * *`, applicationConnect.interval);

sequelize.sync().then(() => {
  console.log('sunc success');
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
