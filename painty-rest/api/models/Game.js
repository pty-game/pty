var Q = require('q')
var _ = require('lodash')

/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    game_actions: {
      collection: 'GameAction',
      via: 'game'
    },
    game_users: {
      collection: 'GameUser',
      via: 'game'
    }
  },
  findWithMinEstimators: Q.async(function *() {
    var games = yield Game.find().populate('game_users')

    return _.sortBy(games, function(game) {
      return game.game_users.length
    })[0]
  })
};
