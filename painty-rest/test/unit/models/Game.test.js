var Q = require('q')
var assert = require('chai').assert

describe('GameModle', function() {
  this.timeout(20000)

/*
  var testIteration = Q.async(function *(testObj, message) {
    var games = yield Game
      .find()
      .populate('game_actions')
      .populate('game_users')

    assert.equal(games.length, testObj.gamesLength, message)

    games.forEach(function(game, gameIndex) {
      var testGame = testObj.games[gameIndex]

      var actions = game.game_actions
      var gameUsers = game.game_users

      assert.isArray(actions, message)
      assert.equal(actions.length, testGame.actionsLength, message)
      assert.equal(gameUsers.length, testGame.gameUsersLength, message)

      gameUsers.forEach(function(gameUser, gameUserIndex) {
        assert.equal(gameUser.user, testGame.gameUsers[gameUserIndex].user, message)
        assert.equal(!!gameUser.is_estimator, !!testGame.gameUsers[gameUserIndex].is_estimator, message)
      })
    })
  })


  describe('#create()', function() {
    it('should be created in crontab', Q.async(function *() {
      var gameApplications = [
        {
          id: 1,
          user: 5,
          is_estimator: true
        },
        {
          id: 2,
          user: 4,
          is_estimator: false
        },
        {
          id: 3,
          user: 3,
          is_estimator: false
        }
      ]

      yield GameApplication.create(gameApplications)

      yield Q.delay(3000)

      yield testIteration({
        gamesLength: 1,
        games: [
          {
            actionsLength: 0,
            gameUsersLength: 2,
            gameUsers: [
              {
                user: gameApplications[1].user,
                is_estimator: gameApplications[1].is_estimator
              },
              {
                user: gameApplications[2].user,
                is_estimator: gameApplications[2].is_estimator
              }
            ]
          }
        ]
      }, 'testIndex 1')


      var gameApplications2 = [
        {
          id: 4,
          user: 2,
          is_estimator: false
        },
        {
          id: 5,
          user: 1,
        },
        {
          id: 6,
          user: 6,
        }
      ]

      yield GameApplication.create(gameApplications2)

      yield Q.delay(4000)

      yield testIteration({
        gamesLength: 2,
        games: [
          {
            actionsLength: 0,
            gameUsersLength: 3,
            gameUsers: [
              {
                user: gameApplications[1].user,
                is_estimator: gameApplications[1].is_estimator
              },
              {
                user: gameApplications[2].user,
                is_estimator: gameApplications[2].is_estimator
              },
              {
                user: gameApplications[0].user,
                is_estimator: gameApplications[0].is_estimator
              }
            ]
          },
          {
            actionsLength: 0,
            gameUsersLength: 2,
            gameUsers: [
              {
                user: gameApplications2[0].user,
                is_estimator: gameApplications2[0].is_estimator
              },
              {
                user: gameApplications2[1].user,
                is_estimator: gameApplications2[1].is_estimator
              }
            ]
          }
        ]
      }, 'testIndex 2')

      var gameApplications = yield GameApplication.find()
      assert.equal(gameApplications.length, 1)
      assert.equal(gameApplications[0].id, 6)
      assert.equal(gameApplications[0].user, 6)
    }));
  });
*/

  describe('#getGameWinnerGameUserId()', function() {
    var game

    before(Q.async(function *() {
      var gameObj = {
        id: 3,
        residue_time: 0,
      }

      var gameUsersArr = [
        {
          id: 1,
          user: 1,
          is_estimator: false,
          game: 3
        },
        {
          id: 2,
          user: 2,
          is_estimator: false,
          game: 3
        },
        {
          id: 3,
          user: 3,
          is_estimator: true,
          game: 3
        },
        {
          id: 4,
          user: 4,
          is_estimator: true,
          game: 3
        }
      ]

      game = yield Game.create(gameObj)

      yield GameUser.create(gameUsersArr)
    }))

    it('should return winner 1', Q.async(function *() {
      var gameActionsArr = [
        {
          id: 1,
          game_user: 3,
          action: {
            instrument: 'estimate',
            playerId: 1
          },
          game: 3
        }
      ]

      var gameActions = yield GameAction.create(gameActionsArr)

      var gameWinnerGameUserId = yield game.getGameWinnerGameUserId()

      assert.equal(gameWinnerGameUserId, 1)
    }))

    it('should return winner null', Q.async(function *() {
      var gameActionsArr = [
        {
          id: 2,
          game_user: 1,
          action: {
            instrument: 'brush',
            ololo: 'awdwad'
          },
          game: 3
        },
        {
          id: 3,
          game_user: 4,
          action: {
            instrument: 'estimate',
            playerId: 2
          },
          game: 3
        },
        {
          id: 4,
          game_user: 4,
          action: {
            instrument: 'estimate',
            playerId: 2
          },
          game: 3
        },
        {
          id: 5,
          game_user: 2,
          action: {
            instrument: 'brush',
            ololo: 'awdwad'
          },
          game: 3
        },
      ]

      var gameActions = yield GameAction.create(gameActionsArr)
      var gameWinnerGameUserId = yield game.getGameWinnerGameUserId()

      assert.equal(gameWinnerGameUserId, null)
    }))
  })


  after(Q.async(function *() {
    promises = [
      GameApplication.find(),
      Game.find(),
      GameUser.find(),
      GameAction.find(),
    ]

    var data = yield Q.all(promises)

    var promises = []

    data.forEach(function(models) {
      models.forEach(function(model) {
        promises.push(model.destroy())
      })
    })

    yield Q.all(promises)
  }));
});
