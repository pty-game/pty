export default class GameApplicationCtrl {
  constructor(db) {
    this.db = db;
  }
  async create({ userId, isEstimator }) {
    const user = await this.db.User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User is not exist');
    }

    const gameApplications = await this.db.GameApplication.findAll({
      where: { userId },
    });

    const promises = [];

    promises.push(
      this.db.GameApplication.create({
        isEstimator,
        userId,
      }),
    );

    gameApplications.forEach((gameApplication) => {
      promises.push(gameApplication.destroy());
    });

    const result = await Promise.all(promises);

    const gameApplication = result[0];

    return gameApplication;
  }
}
