import React from 'react'
import CanvasWrapper from '../canvas-wrapper/canvas-wrapper.jsx'
import Tools from '../tools/tools.jsx'
import {Input} from 'react-bootstrap'

module.exports = function() {
  var myGameUser = _.find(this.state.gameUsers, {user: parseInt(window.userId)})
  //this.state.myGameUser = _.find(game.game_users, {user: parseInt(window.userId)})

  var canvases = _.map(this.state.gameUsers, function(gameUserObj) {
    var isMyGameUser = gameUserObj.user == parseInt(window.userId)

    return <CanvasWrapper gameUser={gameUserObj}
                          isMyGameUser={isMyGameUser}
                          gameUsersActions={this.state.gameUsersActions}>
    </CanvasWrapper>
  }.bind(this))

//=================================================

  return <div>
    <div>
      {canvases}
    </div>
    <Tools gameUsers={this.state.gameUsers}
           myGameUser={myGameUser}></Tools>
  </div>
};


