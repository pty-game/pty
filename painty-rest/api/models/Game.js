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
    task: {
      model: 'Task',
    },
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
      if (this.residueTime) throw 'This game does not finished yet';

      var gameActions = yield GameAction
        .find({game: this.id})
        .populate('game_user');

      var estimatorsGameActions = _.filter(gameActions, function(estimatorsGameAction) {
        return estimatorsGameAction.gameUser.isEstimator
      });

      var uniqEstimatorsGameActions = _.uniqBy(estimatorsGameActions.reverse(), 'gameUser.id');

      var result = _.groupBy(uniqEstimatorsGameActions, 'action.gameUserId');

      result = _.map(result, function(group, gameUserId) {
        var obj = {};

        obj[gameUserId] = group.length;

        return obj;
      });

      var checkNonWinner = (_.uniqBy(result, function(obj) {
        return obj[_.keys(obj)[0]];
      }).length == 1 && result.length != 1) || !result.length;

      if (checkNonWinner) return null;

      result = _.maxBy(result, function(obj) {
        return obj[_.keys(obj)[0]];
      });

      return parseInt(_.keys(result)[0]);
    }),
    isEstimatorsPresent: Q.async(function *() {
      var game = yield Game.findOne({id: this.id}).populate('gameUsers');

      return !!_.filter(game.gameUsers, {isEstimator: true, isBot: false}).length;
    }),
    addAction: Q.async(function *(gameUserId, action, req) {
      if (this.residueTime <= 0) throw 'This Game is finished';

      var gameAction = yield GameAction.create({
        action: action,
        game: this.id,
        gameUser: gameUserId
      });

      Game.message(this.id, wsResponses.message('actionAdded', gameAction), req || null);

      return gameAction
    }),
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
  findWithMinEstimators: Q.async(function *(finderId) {
    var games = yield Game.find().populate('gameUsers');

    var filteredGames = _.filter(games, function(game) {
      return !(_.find(game.game_users, function(gameUser) {
        return !gameUser.isBot && gameUser.user == finderId
      }) || game.residueTime <= sails.config.constants.RESIDUE_TIME_TRESHOLD_FOR_GAME_SEARCH)
    });

    return _.sortBy(filteredGames, function(game) {
      return game.gameUsers.length
    })[0]
  }),
  createNew: Q.async(function *() {
    var tasks = yield Task.find();

    var task = _.sample(tasks);

    var game = yield Game.create({
      task: task.id
    });

    var gameTimeInterval = setInterval(function() {
      Q.async(function *() {
        var _game = yield Game.findOne({
          id: game.id
        }).populate('gameUsers');

        if (!_game)
          return clearInterval(gameTimeInterval);
        else
          game = _game;

        game.residueTime--;

        yield game.saveWithPromise();

        if (game.residueTime <= 0) {
          clearInterval(gameTimeInterval);

          var gameWinnerGameUserId = yield game.getGameWinnerGameUserId();

          var gameUsersPlayers = _.filter(game.game_users, {'isBot': false, 'isEstimator': false})

          var promises = game.gameUsers.map(function(gameUser) {
            return User.findOne({id: gameUser.user});
          })

          var users = yield Promise.all(promises);

          if (gameWinnerGameUserId) {
            var gameWinnerGameUserIndex = _.findIndex(gameUsersPlayers, function (gameUsersPlayer) {
              return gameUsersPlayer.id == gameWinnerGameUserId;
            });

            var gameWinnerUser = users[gameWinnerGameUserIndex];
          }

          users.forEach(Q.async(function *(user, index) {
            user.gamesTotal++;

            if (gameWinnerUser) {
              if (gameWinnerUser.id == user.id) {
                user.experience += User.generateGameWonExperience(user.level);
                user.gamesWon++;

                if (user.experience >= user.nextLevelExperience) {
                  user.level++;

                  user.nextLevelExperience = User.generateNextLevelExperience(user.level);

                  yield user.saveWithPromise();
                  var userSaved = true;

                  User.message(user.id, wsResponses.message('levelUp', {user: user}));
                }
              } else {
                user.gamesLoose++;
              }
            } else {
              user.gamesDraw++;
            }

            if (!userSaved) yield user.save();

            User.message(user.id, wsResponses.message('data', {user: user}));
          }));

          Game.message(game.id, wsResponses.message('finishGame', {gameWinnerGameUserId: gameWinnerGameUserId}));

        } else {
          var isEstimatorsPresent = yield game.isEstimatorsPresent();

          if (game.residueTime <= sails.config.constants.RESIDUE_TIME_FOR_ESTIMATOR_BOTS &&
            game.residueTime >= 1 &&
            !isEstimatorsPresent) {
            GameUser.createBotForGame(game.id, true);
          }
          message = wsResponses.message('residueTime', {residueTime: game.residueTime});
          Game.message(game.id, message);
        }

      })().catch(function(e) {
        console.log(new Error(e).stack)
      })
    }, 1000);

    return game
  })
};
