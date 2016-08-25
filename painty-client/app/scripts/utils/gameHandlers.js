import Q from 'q'
import gameUsersActionsActions from '../actions/gameUsersActions.js'

function actionAdded(result) {
  console.log('actionAdded', result.data.payload)

  var action = result.data.payload.action
  var gameUserId = result.data.payload.game_user
  var gameUser = _.find(this.state.gameUsers, {id: gameUserId})

  gameUsersActionsActions.addItem(result.data.payload)

  if (action.instrument != 'estimate') {
    var options = {
      pathRendered: function(path) {
        gameUser.brush.setPosition(path.x, path.y)
      }.bind(this),
      before: function(action) {
        if (action.instrument === 'undo' || action.instrument === 'redo') {
          return;
        }

        var defer = Q.defer()
        var path = action.coordsArr[0];

        gameUser.brush.animate({
          left: path.x,
          top: path.y
        }, function() {
          defer.resolve()
        })

        return defer.promise
      }.bind(this)
    }

    gameUser.canvas.makeAction(action, options)
  } else {

  }
}

function residueTime(result) {
  console.log(result.data.payload)
}

function finishGame(result) {
  console.log(result.data.payload)

  if (result.data.payload.gameWinnerGameUserId === null)
    var message = 'No one is won.';
  else if (!this.myGameUser.is_estimator) {
    if (result.data.payload.gameWinnerGameUserId == this.myGameUser.id)
      message = 'You won!';
    else
      message = 'You lose!';
  } else {
    //TODO
  }

  alert(message);

  this.history.pushState(null, '/');
}

module.exports = {
  actionAdded,
  residueTime,
  finishGame
}
