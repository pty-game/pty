var Q = require('q')
var passport = require('passport');

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  subscribe: Q.async(function *(req, res) {
    passport.authenticate(req.cookies.strategy, Q.async(function *(error, user, info) {
      var user = yield User.findOne({id: user.id});

      User.subscribe(req, user);
      res.ok(user);
    })).apply(this, arguments);
  }),
  unsubscribe: Q.async(function *(req, res) {
    var user = yield User.findOne({id: req.headers.userId});

    User.unsubscribe(req, user)
    res.ok()
  })
};
