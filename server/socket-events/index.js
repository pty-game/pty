import GameCtrl from '../controllers/game';
import GameApplicationCtrl from '../controllers/game-application';

const gameCtrl = new GameCtrl();
const gameApplicationCtrl = new GameApplicationCtrl();

export default (socket) => {
  socket.on('GAME_APPLICATION CREATE', (payload) => {
    gameApplicationCtrl.create(payload);
  });

  socket.on('GAME ADD_ACTION', (payload) => {
    gameCtrl.addAction(payload);
  });
};
