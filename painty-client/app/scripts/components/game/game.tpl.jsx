import React from 'react'
import CanvasWrapper from '../canvas-wrapper/canvas-wrapper.jsx'
import {Input} from 'react-bootstrap'

module.exports = function() {
  var canvases = _.map(this.state.gameUsers, function(gameUserObj) {
    //this.state.myGameUser = _.find(game.game_users, {user: parseInt(window.userId)})
    var myGameUser = _.find(this.state.gameUsers, {user: parseInt(window.userId)})

    return <CanvasWrapper gameUser={gameUserObj}
                          myGameUser={!!myGameUser}
                          gameUsersActions={this.state.gameUsersActions}>
    </CanvasWrapper>
  }.bind(this))

//=================================================

  return <div>
    <div>
      {canvases}
    </div>
  </div>
};


