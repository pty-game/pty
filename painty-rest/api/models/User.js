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
      defaultsTo: sails.config.constants.NEW_LEVEL_EXPERIENCE_STEP_VALUE
    },
    level: {
      type: 'integer',
      defaultsTo: 0
    }
  },
  generateNextLevelExperience: function(level) {
    return sails.config.constants.NEW_LEVEL_EXPERIENCE_STEP_VALUE * (level + 1) * 1.5;
  },
  generateGameWonExperience: function(level) {
    return sails.config.constants.GAME_WON_EXPERIENCE_VALUE;
  }
};

