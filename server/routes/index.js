import multer from 'multer';
import UserCtrl from '../controllers/user';
import config from '../config';
import SignInHandler from '../handlers/sign-in';

const upload = multer();

export default (app, db) => {
  const signInHandler = new SignInHandler(db, new UserCtrl(db), config);

  app.get('/', (req, res) => {
    res.send('Home');
  });

  app.post('/sign-in', upload.none(), signInHandler.run.bind(signInHandler));
};
