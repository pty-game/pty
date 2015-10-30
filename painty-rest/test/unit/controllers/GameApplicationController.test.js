var request = require('supertest');
var Q = require('q');

var prefix = ''

describe('GameApplicationController', function () {

  describe('#create()', function () {
    describe('for existed user', function () {
      it('for painter', function (done) {
        request(sails.hooks.http.app)
          .post(prefix + '/gameapplication/user/1')
          .send()
          .expect(function(res) {
            delete res.body.createdAt
            delete res.body.updatedAt
            delete res.body.id
          })
          .expect(201, {
            user: 1,
            is_estimator: false
          }, done)
      });

      it('for estimator', function (done) {
        request(sails.hooks.http.app)
          .post(prefix + '/gameapplication/user/1')
          .send({
            is_estimator: true
          })
          .expect(function(res) {
            delete res.body.createdAt
            delete res.body.updatedAt
            delete res.body.id
          })
          .expect(201, {
            user: 1,
            is_estimator: true
          }, done)
      });
    });

    describe('for not existed user', function () {
      it('for painter', function (done) {
        request(sails.hooks.http.app)
          .post(prefix + '/gameapplication/user/555555555')
          .send()
          .expect(function(res)
          {
            delete res.body.createdAt
            delete res.body.updatedAt
            delete res.body.id
          })
          .expect(400, {
            error: 'User is not exist'
          }, done)
      });
    });

    describe('if application already exist for current user - save only last', function () {
      it('for painter', function (done) {
        request(sails.hooks.http.app)
          .post(prefix + '/gameapplication/user/1')
          .send()
          .expect(201)

        request(sails.hooks.http.app)
          .post(prefix + '/gameapplication/user/1')
          .send()
          .expect(201)

        GameApplication.find().then(function(result) {
          done(result.length != 1)
        })
      });
    });
  });

  after(Q.async(function *() {
    var gameApplications = yield GameApplication.find()

    var promises = []

    gameApplications.forEach(function(gameApplication) {
      promises.push(gameApplication.destroy())
    })

    yield Q.all(promises)
  }));
});
