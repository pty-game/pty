export const gameApplicationCreate = async ({ req, userId, isEstimator }, db) => {
  try {
    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User is not exist');
    }

    const gameApplications = await db.GameApplication.findAll({
      where: { userId },
    });

    const promises = [];

    promises.push(
      db.GameApplication.create({
        isEstimator,
        userId,
      }),
    );

    gameApplications.forEach((gameApplication) => {
      promises.push(gameApplication.destroy());
    });

    const result = await Promise.all(promises);

    const gameApplication = result[0];

    // TODO socket
    // db.GameApplication.subscribe(req, gameApplication);

    return gameApplication;
  } catch (err) {
    throw new Error(err);
  }
};

export const other = () => {};