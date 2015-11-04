var Q = require('q')

/**
 * GameApplicationController
 *
 * @description :: Server-side logic for managing gameapplications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res) {
    Q.async(function *() {
      var gameApplication = yield GameApplication.createNew(req.headers.userId, req.body)

      GameApplication.subscribe(req, gameApplication)

      return gameApplication
    })().then(res.created, res.badRequest)
  }
};

