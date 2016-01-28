import React from 'react'
import {Button, Input} from 'react-bootstrap'

module.exports = function() {
  if (!this.props.myGameUser)
    var tools = <div></div>
  else if (!this.props.myGameUser.is_estimator)
    tools = <div>
      <div>
        <a onClick={this.undo}>Undo</a>
        <a onClick={this.redo}>Redo</a>
      </div>
      <div id="brush-width" class="some-slider"></div>
      <div id="brush-opacity" class="some-slider"></div>
      <input class="" id="brush-color"/>
    </div>
  else if (this.props.myGameUser.is_estimator)
    var players = _.filter(this.props.gameUsers, {is_estimator: false})

    tools = _.map(players, function(gameUser) {
      return <Input name="voteFor"
               type="radio"
               label={'Vote to player ' + gameUser.id}
               onChange={this.voteFor.bind(this, gameUser.id)}/>
    }.bind(this))

  return <div className="tools">
    {tools}
  </div>
};
