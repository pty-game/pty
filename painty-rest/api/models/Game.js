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
  findWithMinEstimators: Q.async(function *(finderId) {
    var games = yield Game.find().populate('game_users')

    var filteredGames = _.filter(games, function(game) {
      return !!!_.find(game.game_users, function(gameUser) {
        return gameUser.user == finderId
      })
    })

    return _.sortBy(filteredGames, function(game) {
      return game.game_users.length
    })[0]
  })
};
