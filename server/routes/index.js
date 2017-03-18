import multer from 'multer';
import UserCtrl from '../controllers/user';
import SignInHandler from '../handlers/sign-in';

const upload = multer();

export default (app, db) => {
  const signInHandler = new SignInHandler(db, new UserCtrl(db));

  app.get('/', (req, res) => {
    console.log('Home reqested!!');
    res.send('Home');
  });

  app.post('/sign-in', upload.none(), signInHandler.run.bind(signInHandler));
};
