import GameCtrl from '../controllers/game';
import GameApplicationCtrl from '../controllers/game-application';

export default (ws, db) => {
  const gameCtrl = new GameCtrl(db, ws);
  const gameApplicationCtrl = new GameApplicationCtrl(db);

  ws.on('GAME_APPLICATION_CREATE', async ({ isEstimator }, { id: userId }) => {
    try {
      await gameApplicationCtrl.create({ isEstimator, userId });
    } catch (err) {
      console.error(err);
    }
  });

  ws.on('ADD_GAME_ACTION', async ({ gameId, action }, { id: userId }) => {
    try {
      await gameCtrl.addUserAction({ gameId, userId, action });
    } catch (err) {
      console.error(err);
    }
  });
};
