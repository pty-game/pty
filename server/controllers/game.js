export default {
  subscribe: async (req, res, db) => {
    const { body: { gameId }, headers: { userId } } = req;

    const game = await db.Game.findOne({
      where: { id: gameId },
      include: [db.GameUser],
    });

    const isUserInThisGame = game.getGameUsers().find((gameUser) => {
      return gameUser.userId === userId;
    });

    if (!isUserInThisGame) {
      throw new Error('User is not in this game');
    }

    db.Game.subscribe(req, game);
  },
};
