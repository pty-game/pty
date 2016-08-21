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
    is_bot: 'boolean',
    user: {
      model: 'User',
    },
    game: {
      model: 'Game',
      required: true
    },
    is_bot: 'boolean'
  },
  createBotForGame: Q.async(function *(gameId, isEstimator) {
    var game = yield Game.findOne({id: gameId}).populate('game_users');

    var bot = yield GameUser.create({
      is_estimator: isEstimator,
      is_bot: true,
      game: game.id
    });

    if (isEstimator) {
      var playersGameUsers = _.filter(game.game_users, {is_estimator: false});

      var index = getRandomIntInRange(0, playersGameUsers.length);
      
      game.addAction(bot.id, {
        instrument: 'estimate',
        gameUserId: playersGameUsers[index].id
      })
    }
    
    return bot;
  })
};

