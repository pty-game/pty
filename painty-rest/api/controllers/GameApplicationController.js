var Q = require('q')

/**
 * GameApplicationController
 *
 * @description :: Server-side logic for managing gameapplications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: Q.async(function *(req, res) {
    try {
      var gameApplication = yield GameApplication.createNew(req.params.userId, req.body)

      GameApplication.subscribe(req, gameApplication)
      res.created(gameApplication)
    } catch (error) {
      res.badRequest(error)
    }
  })
};

