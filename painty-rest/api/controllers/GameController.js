var Q = require('q')
var wsResponses = require('../services/wsResponses')

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
      .populate('task');

    var promises = game.gameUsers.map(function(gameUser) {
      return User.findOne({id: gameUser.user});
    });

    var users = yield Promise.all(promises);

    game.gameUsers.forEach(function(gameUser, index) {
      gameUser.user = users[index];
    });

    Game.subscribe(req, game);
    res.ok(game)
  }),
  unsubscribe: Q.async(function *(req, res) {
    var game = yield Game
        .findOne({id: req.params.gameId})

    Game.unsubscribe(req, game)
    res.ok()
  }),
  addAction: Q.async(function *(req, res) {
    var userId = req.headers.userId;
    var gameId = req.params.gameId;

    var game = yield Game.findOne({id: gameId});
    var gameUser = yield GameUser.findOne({user: userId, game: gameId, isBot: false});

    if (!gameUser) {
      throw 'This GameUser is not allowed for this game';
    }

    if (!game) {
      throw 'This Game is not found';
    }

    game.addAction(gameUser.id, req.body, req)
      .then(function(gameAction) {
        res.ok(gameAction)
      }, res.serverError)
  })
};
