import React from 'react'
import Reflux from 'Reflux'
import Canvas from '../../api/canvasAPI'
import Cursor from '../../api/cursorAPI'
import Mouse from '../../api/mouseAPI'
import GameAPI from '../../api/gameAPI.js'
import Constants from '../../constants/constants'
import Q from 'q'
import suspend from 'suspend'
import Template from './game.tpl.jsx'
import History from 'react-router/lib/History.js'
import gameHandlers from '../../utils/gameHandlers.js'
import gameUsersStore from '../../stores/gameUsers.js'


//============================================================


function toggleDrawingMode(mode) {
  this.state.gameUsers[this.state.myGameUser.id].canvas.setDrawingMode(mode)
}

function undo() {
  return this.state.gameUsers[this.state.myGameUser.id].canvas.undo()
}

function redo() {
  return this.state.gameUsers[this.state.myGameUser.id].canvas.redo()
}

function voteFor(playerId) {
  var action = {
    instrument: 'estimate',
    playerId: playerId
  }

  GameAPI.addAction(this.props.params.gameId, action)
}


//============================================================


var _getGame = suspend.promise(function *() {
  var game = yield GameAPI.subscribe(this.props.params.gameId)

  return game
})

function _initMy(gameUserId) {
  this.setState(function(prev) {
    prev.gameUsers[gameUserId] = {
      canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower').setMode('instrument', Constants.BRUSH),
      brush: Cursor(gameUserId + '-brush'),
      cursor: Cursor(gameUserId + '-cursor'),
      paintyArea: Mouse('.' + gameUserId + '.canvas-wrapper .painty-area')
    }
  })

  this.state.gameUsers[gameUserId].paintyArea.onMouse('down', function(coords) {
    this.state.gameUsers[gameUserId].canvas.startDraw(coords)
  }.bind(this))

  this.state.gameUsers[gameUserId].paintyArea.onMouse('move', function(coords) {
    this.state.gameUsers[gameUserId].cursor.setPosition(coords.x, coords.y)
    this.state.gameUsers[gameUserId].brush.setPosition(coords.x, coords.y)
    this.state.gameUsers[gameUserId].canvas.drawing(coords)
  }.bind(this))

  this.state.gameUsers[gameUserId].paintyArea.onMouse('up', function() {
    this.state.gameUsers[gameUserId].canvas.stopDraw()
  }.bind(this))

  this.state.gameUsers[gameUserId].paintyArea.onMouse('over', function() {
    this.state.gameUsers[gameUserId].brush.show()
    this.state.gameUsers[gameUserId].cursor.show()
  }.bind(this))

  this.state.gameUsers[gameUserId].paintyArea.onMouse('out', function() {
    this.state.gameUsers[gameUserId].brush.hide()
    this.state.gameUsers[gameUserId].cursor.hide()
  }.bind(this))

  this.state.gameUsers[gameUserId].canvas.onChange(function(action) {
    GameAPI.addAction(this.props.params.gameId, action)
  }.bind(this))

  $('#brush-width').slider({
    min: Constants.BRUSH_WIDTH_MIN,
    max: Constants.BRUSH_WIDTH_MAX,
    value: Constants.BRUSH_WIDTH_INIT,
    step: Constants.BRUSH_WIDTH_STEP,
    slide: function(e, ui) {
      this.setState(function(prev) {
        prev.brush.size = ui.value;
      })
    }.bind(this)
  })

  $('#brush-opacity').slider({
    min: Constants.BRUSH_OPACITY_MIN,
    max: Constants.BRUSH_OPACITY_MAX,
    value: Constants.BRUSH_OPACITY_INIT,
    step: Constants.BRUSH_OPACITY_STEP,
    slide: function(e, ui) {
      this.setState(function(prev) {
        prev.brush.opacity = ui.value;
      })
    }.bind(this)
  })

  $('#brush-color').minicolors({
    defaultValue: Constants.BRUSH_COLOR_INIT,
    change: function(color) {
      this.setState(function(prev) {
        prev.brush.color = color;
      })
    }.bind(this)
  })
}

function _initOpponent(gameUserId) {
  this.setState(function(prev) {
    prev.gameUsers[gameUserId] = {
      canvas: Canvas(gameUserId + '-upper', gameUserId + '-lower', false),
      brush: Cursor(gameUserId + '-brush')
    }
  })
}

function _makeInitActions(gameActions) {
  gameActions.forEach(function(gameAction) {
    var action = gameAction.action

    var options = {
      initAction: true
    }

    this.state.gameUsers[gameAction.game_user].canvas.makeAction(action, options)
  }.bind(this))
}

function _initGame(game) {
  //this.state.myGameUser = _.find(game.game_users, {user: $.cookie('userId')})
  this.setState(function(prev) {
    prev.myGameUser = _.find(game.game_users, {user: parseInt(window.userId)})
  })

  if (!this.state.myGameUser)
    throw 'This game is not available'

  var nextOpponentCanvasId = this.state.myGameUser.is_estimator ? 0 : 1

  game.game_users.forEach(function(gameUser) {
    if (gameUser.is_estimator) return

    if (gameUser.id == this.state.myGameUser.id)
      var fn = _initMy
    else
      fn = _initOpponent

    fn.call(this, gameUser.id)
  }.bind(this))

  _makeInitActions.call(this, game.game_actions)

  GameAPI.on(function(result) {
    gameHandlers[result.data.message].call(this, result)
  }.bind(this))
}

function _offOpponentCanvas() {
  GameAPI.off()
  GameAPI.unsubscribe(this.props.params.gameId)
}


//============================================================


function getInitialState() {
  return {
    brush: {},
    gameUsers: {}
  }
}

var componentDidMount = suspend(function *() {
  var game = yield _getGame.call(this)

  try {
    _initGame.call(this, game)
  } catch(e) {
    console.error(e)
    this.history.pushState(null, '/')
  }

  this.setState(function(prev) {
    prev.brush.size = Constants.BRUSH_WIDTH_INIT;
    prev.brush.opacity = Constants.BRUSH_OPACITY_INIT;
    prev.brush.color = Constants.BRUSH_COLOR_INIT;
  })
})

function componentWillUnmount() {
  _offOpponentCanvas.call(this)
}

function render() {
  if (this.state.myGameUser && !this.state.myGameUser.is_estimator && this.state.gameUsers[this.state.myGameUser.id]) {
    this.state.gameUsers[this.state.myGameUser.id].canvas.setMode('size', this.state.brush.size)
    this.state.gameUsers[this.state.myGameUser.id].canvas.setMode('opacity', this.state.brush.opacity / 100)
    this.state.gameUsers[this.state.myGameUser.id].canvas.setMode('color', this.state.brush.color)
  }
  console.log(this)
  return Template.call(this)
}


//============================================================


module.exports = React.createClass({
  mixins: [
    History,
    Reflux.connect(gameUsersStore, 'gameUsers')
  ],
  undo,
  redo,
  voteFor,
  getInitialState,
  componentDidMount,
  componentWillUnmount,
  toggleDrawingMode,
  render
})