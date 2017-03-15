import jwt from 'jsonwebtoken';
import UserCtrl from '../controllers/user';
import config from '../config';

const userCtrl = new UserCtrl();

export default (app) => {
  app.get('/', (req, res) => {
    res.send('Home');
  });

  app.get('/signIn', async (req, res) => {
    try {
      const user = await userCtrl.signIn(req.body);

      delete user.password;

      const token = jwt.sign(user, config.JWT_SECRET, { expiresInMinutes: 60 * 24 });

      res.json({ token });
    } catch (err) {
      res.send(500, err);
    }
  });
};
