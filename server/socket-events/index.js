import GameCtrl from '../controllers/game';
import GameApplicationCtrl from '../controllers/game-application';

export default (ws, db) => {
  const gameCtrl = new GameCtrl(db);
  const gameApplicationCtrl = new GameApplicationCtrl(db);

  ws.on('GAME_APPLICATION_CREATE', ({ isEstimator }, { id: userId }) => {
    gameApplicationCtrl.create({ isEstimator, userId });
  });

  ws.on('GAME_ADD_ACTION', (payload) => {
    gameCtrl.addAction(payload);
  });
};
