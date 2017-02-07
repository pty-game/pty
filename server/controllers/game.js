export const subscribe = async ({ req, userId, gameId }, db) => {
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

export const unsubscribe = async ({ req, userId, gameId }, db) => {
  const game = await db.Game.find({ id: gameId });

  // TODO socket
  // db.Game.unsubscribe(req, game);

  return game;
};

export const addAction = async ({ req, userId, gameId, action }, db) => {
  const game = await db.Game.find({ id: gameId });
  const gameUser = await db.GameUser.find({ userId, gameId, isBot: false });

  if (!gameUser) {
    throw new Error('This GameUser is not allowed for this game');
  }

  if (!game) {
    throw new Error('This Game is not found');
  }

  if (game.residueTime <= 0) throw new Error('This Game is finished');

  const gameAction = await db.GameAction.create({
    action,
    gameId,
    gameUserId: gameUser.id,
  });

  // TODO socket
  // Game.message(this.id, wsResponses.message('actionAdded', gameAction), req || null);

  return gameAction;
};
