import multer from 'multer';
import UserCtrl from '../controllers/user';
import SignInHandler from '../handlers/sign-in';
import SignUpHandler from '../handlers/sign-up';

const upload = multer();

export default (app, db) => {
  const userCtrl = new UserCtrl(db);

  const signInHandler = new SignInHandler(db, userCtrl);
  const signUpHandler = new SignUpHandler(db, userCtrl);

  app.get('/', (req, res) => {
    res.send('Home');
  });

  app.post('/sign-in', upload.none(), signInHandler.run.bind(signInHandler));
  app.post('/sign-up', upload.none(), signUpHandler.run.bind(signUpHandler));
};
