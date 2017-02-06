/**
* GameUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Q = require('q')

function getRandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

module.exports = {
  attributes: {
    is_estimator: 'boolean',
    is_bot: {
      type: 'boolean',
      defaultsTo: false
    },
    user: {
      model: 'User',
    },
    game: {
      model: 'Game',
      required: true
    },
    game_actions: {
      collection: 'GameAction',
      via: 'game_user'
    },
    gameActionsEmulator: Q.async(function *(game, gameActions) {
      var date;

      gameActions.forEach(function(gameAction) {
        var timeout = date ?
          new Date(gameAction.createdAt).getTime() - new Date(date).getTime() :
          0;

        setTimeout(function() {
          game.addAction(this.id, gameAction.action)
        }.bind(this), timeout)

        date = gameAction.createdAt;
      }.bind(this))
    })
  },
  createBotForGame: Q.async(function *(gameId, isEstimator, gameApplicationUserId) {
    var game = yield Game.findOne({id: gameId})
      .populate('gameUsers');

    if (isEstimator) {
      var bot = yield GameUser.create({
        isEstimator: true,
        isBot: true,
        game: game.id
      });

      var playersGameUsers = _.filter(game.gameUsers, {isEstimator: false});

      var index = getRandomIntInRange(0, playersGameUsers.length);

      game.addAction(bot.id, {
        instrument: 'estimate',
        gameUserId: playersGameUsers[index].id
      })
    } else {
      var gamesWithSameTask = yield Game.find({
        task: game.task,
        id: {
          '!': game.id
        }
      }).populate('gameUsers');

      var gamesWithSameTask = gamesWithSameTask.filter(function(game) {
        return !_.find(game.gameUsers, {user: gameApplicationUserId, isBot: false});
      });

      if (!gamesWithSameTask.length) return null;

      var gameWithSameTask = _.sample(gamesWithSameTask);

      var gameUsersWithSameTask = _.filter(gameWithSameTask.gameUsers, {
        isEstimator: false,
        isBot: false
      });

      if (!gameUsersWithSameTask.length) return null;

      var gameUserWithSameTask = _.sample(gameUsersWithSameTask);

      var gameUserWithSameTask = yield GameUser.findOne({id: gameUserWithSameTask.id})
        .populate('gameActions');

      var bot = yield GameUser.create({
        isEstimator: false,
        isBot: true,
        game: game.id,
        user: gameUserWithSameTask.user
      });

      bot.gameActionsEmulator(game, gameUserWithSameTask.gameActions)
    }
    return bot;
  })
};
