import React from 'react'
import {Button, Input} from 'react-bootstrap'

module.exports = function() {
  if (!this.props.myGameUser)
    var tools = <div></div>
  else if (!this.props.myGameUser.is_estimator)
    tools = <div className="tools">
      <div>
        <a onClick={this.undo}>Undo</a>
        <a onClick={this.redo}>Redo</a>
      </div>
      <div id="brush-width" class="some-slider"></div>
      <div id="brush-opacity" class="some-slider"></div>
      <input class="" id="brush-color"/>
    </div>
  else if (this.state.myGameUser.is_estimator)
    tools = <div className="tools">
      <Input name="voteFor"
             type="radio"
             label="Vote to player 1"
             ref="voteFor-0"
             value="0"
             onChange={this.voteFor.bind(this, 0)}/>
      <Input name="voteFor"
             type="radio"
             label="Vote to player 2"
             ref="voteFor-1"
             value="1"
             onChange={this.voteFor.bind(this, 1)}/>
    </div>

  return <div>
    {tools}
  </div>
};
