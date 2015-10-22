var Q = require('q')


/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  subscribe: Q.async(function *(req, res) {
    var game = yield Game
      .findOne({id: req.params.gameId})
      .populate('game_actions')
      .populate('game_users')

    Game.subscribe(req, game)
    res.ok(game)
  }),
  addAction: function(req, res) {
    Q.async(function *() {
      var gameUserLogin = req.body.login
      var gameId = req.params.gameId

      var gameUser = yield GameUser.findOne({user: gameUserLogin, game: gameId})

      if (!gameUser) throw 'This GameUser is not allowed for this game'

      var gameAction = yield GameAction.create({
        action: req.body.action,
        game: gameId,
        game_user: gameUserLogin
      })

      return gameAction
    })().then(function(gameAction) {
      res.ok(gameAction)
    }, function(error) {
      res.serverError(error)
    })
  }
};
