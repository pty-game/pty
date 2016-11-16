var Q = require('q')

/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    login: 'string',
    experience: {
      type: 'integer',
      defaultsTo: 0
    },
    nextLevelExperience: {
      type: 'integer',
      defaultsTo: sails.config.constants.GAME_WON_EXPERIENCE_VALUE
    },
    level: {
      type: 'integer',
      defaultsTo: 0
    },
    games_total: {
      type: 'integer',
      defaultsTo: 0
    },
    games_won: {
      type: 'integer',
      defaultsTo: 0
    },
    games_loose: {
      type: 'integer',
      defaultsTo: 0
    },
    games_draw: {
      type: 'integer',
      defaultsTo: 0
    },
    saveWithPromise: function() {
      var def = Q.defer();

      this.save(function(err, result) {
        if (err)
          def.reject(err);
        else
          def.resolve(result);
      })

      return def.promise;
    }
  },
  generateNextLevelExperience: function(level) {
    return sails.config.constants.GAME_WON_EXPERIENCE_VALUE * ((level + 1) * (level + 1)) * (level + 1);
  },
  generateGameWonExperience: function(level) {
    return sails.config.constants.GAME_WON_EXPERIENCE_VALUE * (level + 1);
  }
};
