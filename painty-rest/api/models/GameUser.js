/**
* GameUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    is_estimator: 'boolean',
    user: {
      model: 'User',
      required: true
    },
    game: {
      model: 'Game',
      required: true
    },
  }
};

