var Q = require('q')
var _ = require('lodash')
var wsResponses = require('../api/services/wsResponses')

function _findOpponentForPlayer(gameApplication, gameApplications) {
  return _.find(gameApplications, function(gameApplicationSub) {
    var condition =
      !gameApplicationSub.is_estimator &&
      gameApplication.id != gameApplicationSub.id;

    if (condition)
      return gameApplicationSub
  })
}

module.exports = function(sails) {
  return Q.async(function *(sails) {
    var gameApplications = yield GameApplication.find();

    for (var index = 0; index < gameApplications.length; index++) {

      var gameApplication = gameApplications[index];

      gameApplication.residue_time = gameApplication.residue_time - sails.config.constants.GAME_APPLICATION_CRONTAB_TIMEOUT;

      if (gameApplication.residue_time < 0) {
        gameApplication.destroy();

        gameApplications.splice(index, 1);
        index--;

        GameApplication.message(gameApplication.id, wsResponses.message('gameApplicationExpired'));

        continue;
      } else {
        yield gameApplication.save();
      }

      if (!gameApplication.is_estimator) {
        var gameApplicationSub = _findOpponentForPlayer(gameApplication, gameApplications);

        if (!gameApplicationSub && gameApplication.residue_time > sails.config.constants.RESIDUE_TIME_FOR_PAINTER_BOTS) {
          continue;
        }

        var game = yield Game.createNew();

        if (!gameApplicationSub && gameApplication.residue_time <= sails.config.constants.RESIDUE_TIME_FOR_PAINTER_BOTS) {
          var bot = yield GameUser.createBotForGame(game.id, false, gameApplication.user);

          if (!bot) {
            game.destroy();

            continue;
          }
        }

        var gameUsers = [
          {
            user: gameApplication.user,
            game: game.id,
            is_estimator: false
          }
        ];

        if (gameApplicationSub)
          gameUsers.push({
            user: gameApplicationSub.user,
            game: game.id,
            is_estimator: false
          })

        yield GameUser.create(gameUsers);

        var message = wsResponses.message('gameFound', {gameId: game.id});

        GameApplication.message(gameApplication.id, message)
        if (gameApplicationSub) GameApplication.message(gameApplicationSub.id, message)

        gameApplication.destroy()

        gameApplications.splice(index, 1);

        index--;

        if (gameApplicationSub) {
          gameApplicationSub.destroy()

          var subIndex = _.findIndex(gameApplications, {id: gameApplicationSub.id})

          gameApplications.splice(subIndex, 1)
        }
      } else {
        var game = yield Game.findWithMinEstimators(gameApplication.user)

        if (!game) continue

        yield GameUser.create({
          user: gameApplication.user,
          game: game.id,
          is_estimator: true
        })

        GameApplication.message(gameApplication.id, wsResponses.message('gameFound', {gameId: game.id}))

        gameApplication.destroy();
      }
    }
  })(sails).catch(function(e) {
    console.log(new Error(e).stack);
  });
};