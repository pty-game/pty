var Q = require('q')
var _ = require('lodash')
var wsResponses = require('../services/wsResponses')

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
    },
    residueTime: {
      type: 'integer',
      defaultsTo: sails.config.constants.GAME_DURATION
    }
  },
  findWithMinEstimators: Q.async(function *(finderId) {
    var games = yield Game.find().populate('game_users')

    var filteredGames = _.filter(games, function(game) {
      return !(_.find(game.game_users, function(gameUser) {
        return gameUser.user == finderId
      }) || game.residueTime <= sails.config.constants.RESIDUE_TIME_TRESHOLD_FOR_GAME_SEARCH)
    })

    return _.sortBy(filteredGames, function(game) {
      return game.game_users.length
    })[0]
  }),
  createNew: Q.async(function *() {
    var game = yield Game.create()

    var gameTimeInterval = setInterval(Q.async(function *() {
      game.residueTime--

      game.save(function() {
        if (game.residueTime <= 0) {
          clearInterval(gameTimeInterval)

          var message = wsResponses.message('finishGame')
        } else
          message = wsResponses.message('residueTime', {residueTime: game.residueTime})

        Game.message(game.id, message)
      })
    }), 1000)

    return game
  })
};