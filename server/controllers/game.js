export const gameSubscribe = async ({ req, userId, gameId }, db) => {
  const game = await db.Game.find({
    where: { id: gameId },
    include: [db.GameUser],
  });

  const isUserInThisGame = game.gameUsers.find((gameUser) => {
    return gameUser.userId === userId;
  });

  if (!isUserInThisGame) {
    throw new Error('User is not in this game');
  }
  // TODO socket
  // db.Game.subscribe(req, game);

  return game;
};

export const a = 1;
