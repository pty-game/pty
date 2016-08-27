var Q = require('q')

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  subscribe: Q.async(function *(req, res) {
    var user = yield User.findOne({id: req.headers.userId});
    console.log(user)
    User.subscribe(req, user)
    res.ok(user)
  }),
  unsubscribe: Q.async(function *(req, res) {
    var user = yield User.findOne({id: req.headers.userId});

    User.unsubscribe(req, user)
    res.ok()
  })
};

