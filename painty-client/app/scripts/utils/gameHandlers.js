import Q from 'q'

function actionAdded(result) {
  var action = result.data.payload.action
  var gameUserId = result.data.payload.game_user

  var options = {
    pathRendered: function(path) {
      this.state.gameUsers[gameUserId].brush.setPosition(path.x, path.y)
    }.bind(this),
    before: function(action) {
      if (action.instrument === 'undo' || action.instrument === 'redo') {
        return;
      }

      var defer = Q.defer()
      var path = action.coordsArr[0];

      this.state.gameUsers[gameUserId].brush.animate({
        left: path.x,
        top: path.y
      }, function() {
        defer.resolve()
      })

      return defer.promise
    }.bind(this)
  }

  this.state.gameUsers[gameUserId].canvas.makeAction(action, options)
}

function residueTime(result) {
  console.log(result.data.payload)
}

function finishGame(result) {
  console.log(result.data.payload)
}

module.exports = {
  actionAdded,
  residueTime,
  finishGame,
}
