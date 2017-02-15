import express from 'express';
import Sequelize from 'sequelize';
import socketIO from 'socket.io';
import models from './models';
import routes from './routes';

const app = express();

const io = socketIO(3001);

io.on('connection', (socket) => {
  socket.emit('connected', { hello: 'world' });
});

const sequelize = new Sequelize('painty', 'painty', 'painty', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = models(sequelize);

routes(app, db);

sequelize.sync().then(() => {
  console.log('sunc success');
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
