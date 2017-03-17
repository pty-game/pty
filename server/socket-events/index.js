import { wsGenerateMessage } from 'pty-common/wsMessage';
import GameCtrl from '../controllers/game';
import GameApplicationCtrl from '../controllers/game-application';

const gameCtrl = new GameCtrl();
const gameApplicationCtrl = new GameApplicationCtrl();

export default (socket) => {
  socket.send(wsGenerateMessage('subscribed', { a: 11 }));

  socket.on('GAME_APPLICATION_CREATE', (payload) => {
    gameApplicationCtrl.create(payload);
  });

  socket.on('GAME_ADD_ACTION', (payload) => {
    gameCtrl.addAction(payload);
  });
};
