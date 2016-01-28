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
    residue_time: {
      type: 'integer',
      defaultsTo: sails.config.constants.GAME_DURATION
    },
    getGameWinnerGameUserId: Q.async(function *() {
      if (game.residue_time) throw 'This game does not finished yet'

      var gameActions = yield GameActions
        .find()
        .populate('game_user')

      var estimatorsGameActions = _.filter(gameActions, ['game_user.is_estimator', true])
      estimatorsGameActions = _.uniqBy(estimatorsGameActions.reverse(), 'game_user.id')

      var result = _.groupBy(estimatorsGameActions, 'action.playerId')

      result = _.map(result, function(group, playerId) {
        return {playerId: group.length}
      })

      result = _.max(result, function(obj) {
        return obj[_.keys(obj)[0]]
      })

      return result = _.keys(obj)[0]
    })
  },
  findWithMinEstimators: Q.async(function *(finderId) {
    var games = yield Game.find().populate('game_users')

    var filteredGames = _.filter(games, function(game) {
      return !(_.find(game.game_users, function(gameUser) {
        return gameUser.user == finderId
      }) || game.residue_time <= sails.config.constants.RESIDUE_TIME_TRESHOLD_FOR_GAME_SEARCH)
    })

    return _.sortBy(filteredGames, function(game) {
      return game.game_users.length
    })[0]
  }),
  createNew: Q.async(function *() {
    var game = yield Game.create()

    var gameTimeInterval = setInterval(Q.async(function *() {
      game.residue_time--

      game.save(Q.async(function() {
        if (game.residue_time <= 0) {
          clearInterval(gameTimeInterval)

          var gameWinnerGameUserId = yield game.getGameWinnerGameUserId()

          var message = wsResponses.message('finishGame', {gameWinnerGameUserId: gameWinnerGameUserId})
        } else
          message = wsResponses.message('residueTime', {residue_time: game.residue_time})

        Game.message(game.id, message)
      }))
    }), 1000)

    return game
  })
};