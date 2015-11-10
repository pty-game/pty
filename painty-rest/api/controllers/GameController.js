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
  unsubscribe: Q.async(function *(req, res) {
    var game = yield Game
        .findOne({id: req.params.gameId})

    Game.unsubscribe(req, game)
    res.ok()
  }),
  addAction: function(req, res) {
    var userId = req.headers.userId
    var gameId = req.params.gameId

    Q.async(function *() {
      var gameUser = yield GameUser.findOne({user: userId, game: gameId})

      if (!gameUser) throw 'This GameUser is not allowed for this game'

      var gameAction = yield GameAction.create({
        action: req.body,
        game: gameId,
        game_user: gameUser.id
      })

      return gameAction
    })().then(function(gameAction) {
      Game.message(gameId, gameAction, req)

      res.ok(gameAction)
    }, res.serverError)
  }
};
