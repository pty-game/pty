export default (app) => {
  app.get('/', (req, res) => {
    res.send('Home');
  });

  app.get('/user/subscribe', (req, res) => {
    res.send();
  });
};
