var Q = require('q')
var _ = require('lodash')

function _findOpponentForPlayer(gameApplication, gameApplications) {
  return _.find(gameApplications, function(gameApplicationSub) {
    var condition =
      !gameApplicationSub.is_estimator &&
      gameApplication.id != gameApplicationSub.id

    if (condition)
      return gameApplicationSub
  })
}

module.exports = {
  run: Q.async(function *() {
    var gameApplications = yield GameApplication.find()

    for (var index = 0; index < gameApplications.length; index++) {
      var gameApplication = gameApplications[index]

      if (!gameApplication.is_estimator) {
        var gameApplicationSub = _findOpponentForPlayer(gameApplication, gameApplications)

        if (!gameApplicationSub) continue

        var game = yield Game.create()

        yield GameUser.create([
          {
            user: gameApplication.user,
            game: game.id,
            is_estimator: false
          },
          {
            user: gameApplicationSub.user,
            game: game.id,
            is_estimator: false
          }
        ])

        GameApplication.message(gameApplication.id, {gameId: game.id})
        GameApplication.message(gameApplicationSub.id, {gameId: game.id})

        gameApplication.destroy()
        gameApplicationSub.destroy()

        var subIndex = _.findIndex(gameApplications, {id: gameApplicationSub.id})

        gameApplications.splice(index, 1)
        gameApplications.splice(subIndex - 1, 1)

        index--
      } else {
        var game = yield Game.findWithMinEstimators()

        if (!game) continue

        yield GameUser.create({
          user: gameApplication.user,
          game: game.id,
          is_estimator: true
        })

        GameApplication.message(gameApplication.id, {gameId: game.id})

        gameApplication.destroy()
      }
    }
  })
};