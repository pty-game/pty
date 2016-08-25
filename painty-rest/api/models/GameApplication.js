var vow = require('vow')
var Q = require('q')
var _ = require('lodash')

/**
 * GameApplication.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    user: {
      model: 'User',
      required: true
    },
    is_estimator: {
      type: 'boolean',
      defaultsTo: false
    },
    residue_time: {
      type: 'integer',
      defaultsTo: sails.config.constants.GAME_APPLICATION_DURATION
    },
  },
  createNew: Q.async(function *(userId, data) {
    var user = yield User.findOne({id: userId})

    if (!user)
      throw 'User is not exist'

    var gameApplications = yield GameApplication.find({user: userId})

    var promises = {}

    gameApplications.forEach(function(gameApplication, index) {
      promises[index] = gameApplication.destroy()
    })

    _.extend(data, {user: userId})
    promises['new'] = GameApplication.create(data)

    var all = yield Q.all(promises)

    return all.new
  })
};

