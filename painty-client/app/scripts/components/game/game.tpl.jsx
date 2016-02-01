import React from 'react'
import CanvasWrapper from '../canvas-wrapper/canvas-wrapper.jsx'
import Tools from '../tools/tools.jsx'
import {Input} from 'react-bootstrap'

module.exports = function() {
  if (!this.state.gameUsers || !this.state.gameUsersActions) return <div></div>

  var myGameUser = _.find(this.state.gameUsers, {user: parseInt($.cookie('userId'))})

  var canvases = _.map(this.state.gameUsers, function(gameUserObj) {
    var isMyGameUser = gameUserObj.user == parseInt($.cookie('userId'))

    if (gameUserObj.is_estimator) return

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
           myGameUser={myGameUser}
           params={this.props.params}>
    </Tools>
  </div>
};


