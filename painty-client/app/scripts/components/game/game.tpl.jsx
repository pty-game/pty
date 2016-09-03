import React from 'react'
import CanvasWrapper from '../canvas-wrapper/canvas-wrapper.jsx'
import Tools from '../tools/tools.jsx'
import {Input} from 'react-bootstrap'

module.exports = function() {
  if (!this.state.gameUsers || !this.state.gameUsersActions) return <div></div>

  this.myGameUser = _.find(this.state.gameUsers, function(gameUser) {
    return gameUser.is_bot == false && gameUser.user.id == parseInt($.cookie('userId'));
  });

  var canvases = _.map(this.state.gameUsers, function(gameUser) {
    var isMyGameUser = gameUser.is_bot == false && gameUser.user.id == parseInt($.cookie('userId'));

    if (gameUser.is_estimator) return;

    return <CanvasWrapper gameUser={gameUser}
                          isMyGameUser={isMyGameUser}
                          gameUsersActions={this.state.gameUsersActions}>
    </CanvasWrapper>
  }.bind(this))

//=================================================

  return <div>
    <div>
      {this.state.game.task.name}
    </div>
    <div>
      {canvases}
    </div>
    <Tools gameUsers={this.state.gameUsers}
           myGameUser={this.myGameUser}
           params={this.props.params}>
    </Tools>
  </div>
};


