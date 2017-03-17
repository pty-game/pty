import jwt from 'jsonwebtoken';
import { errorResponse } from '../helpers';

export default class SignInHandler {
  constructor(db, userCtrl, config) {
    this.db = db;
    this.userCtrl = userCtrl;
    this.config = config;
  }

  async run(req, res) {
    try {
      const result = await this.userCtrl.signIn(req.body);
      const user = result.toJSON();

      delete user.password;

      const token = jwt.sign(user, this.config.JWT_SECRET);

      res.json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).send(errorResponse(err.message));
    }
  }
}
