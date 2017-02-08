import { generateGameWonExperienceFromLevel } from '../helpers';
import * as gameConfig from '../game-config';

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
  const game = await db.Game.findOne({ where: { id: gameId } });
  // TODO socket
  // db.Game.unsubscribe(req, game);

  return game;
};

export const addAction = async ({ req, userId, gameId, action }, db) => {
  const game = await db.Game.find({ where: { id: gameId } });
  const gameUser = await db.GameUser.find({ where: { userId, gameId, isBot: false } });

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

export const updateUsersStatistic = async (users, gameWinnerUser) => {
  /* eslint-disable no-param-reassign */
  users.forEach(async (user) => {
    user.gamesTotal += 1;

    if (gameWinnerUser) {
      if (gameWinnerUser.id === user.id) {
        user.experience += generateGameWonExperienceFromLevel(user.level);
        user.gamesWon += 1;
      } else {
        user.gamesLoose += 1;
      }
    } else {
      user.gamesDraw += 1;
    }

    await user.save();
    // TODO socket
    // User.message(user.id, wsResponses.message('data', {user: user}));
  });

  return users;

  /* eslint-enable no-param-reassign */
};

export const finishGame = async ({ game }, db) => {
  const gameWinnerGameUserId = await game.getGameWinnerGameUserId();

  const gameUsersPlayers = game.gameUsers.filter((gameUser) => {
    return gameUser.isBot === false && gameUser.isEstimator === false;
  });

  const users = await game.gameUsers.map((gameUser) => {
    return db.User.find({ where: { id: gameUser.userId } });
  });

  let gameWinnerUser = null;

  if (gameWinnerGameUserId) {
    const gameWinnerGameUserIndex = gameUsersPlayers.findIndex((gameUsersPlayer) => {
      return gameUsersPlayer.id === gameWinnerGameUserId;
    });

    gameWinnerUser = users[gameWinnerGameUserIndex];
  }

  await updateUsersStatistic(users, gameWinnerUser);

  // TODO socket
  // db.Game.message(
  //  game.id,
  //  wsResponses.message('finishGame', {gameWinnerGameUserId: gameWinnerGameUserId}));
};

export const timeIntervalIteration = async (
  {
    gameTimeIntervalObj: { intervalId },
    gameId,
  },
  db,
) => {
  const game = await db.Game.find({
    where: { id: gameId },
    include: [db.GameUser],
  });

  if (!game) {
    return clearInterval(intervalId);
  }

  game.residueTime -= 1;

  await game.save();

  if (game.residueTime <= 0) {
    clearInterval(intervalId);
    finishGame({ game }, db);
  } else {
    const isEstimatorsPresent = await game.isEstimatorsPresent();

    if (
      game.residueTime <= gameConfig.RESIDUE_TIME_FOR_ESTIMATOR_BOTS &&
      game.residueTime >= 1 &&
      !isEstimatorsPresent
    ) {
      db.GameUser.createBotForGame(game.id, true);
    }

    // TODO
    // db.Game.message(
    //   game.id,
    //   wsResponses.message('residueTime', { residueTime: game.residueTime }),
    // );
  }

  return true;
};

export const create = async ({ req }, db) => {
  const tasks = await db.Task.findAll();

  const taskId = tasks[Math.floor(Math.random() * tasks.length)].id;

  const game = await db.Game.create({ taskId });

  // Object for provide interval id by link
  const gameTimeIntervalObj = {};

  gameTimeIntervalObj.itervalId = setInterval(
    timeIntervalIteration.bind(this, { gameTimeIntervalObj }, db),
    1000,
  );

  return game;
};
