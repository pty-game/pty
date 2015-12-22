import React from 'react'
import {Input} from 'react-bootstrap'

module.exports = function() {
  var cursorStyle = {
    width: this.state.brush.size,
    height: this.state.brush.size
  };

  if (!this.state.myGameUser)
    var tools
  else if (!this.state.myGameUser.is_estimator)
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

  var oponents = _.without(this.state.gameUsers, function(gameUserObj, gameUserId) {
    return gameUserId == this.state.myGameUser.id
  })

  var oppenontCanvases = _.map(oponents, function(gameUserObj, gameUserId) {
    return <div className={'canvas-wrapper ' + gameUserId}>
      <canvas className="canvas upper"
              width="300"
              height="300"
              id={gameUserId + '-upper'}>
      </canvas>
      <canvas className="canvas lower"
              width="300"
              height="300"
              id={gameUserId + '-lower'}>
      </canvas>
      <div className="painty-area"></div>
      <div className="brush" id={gameUserId + '-brush'}>
        <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png"
             alt=""/>
      </div>
      <div className="cursor" id={gameUserId + '-cursor'}>
        <i style={cursorStyle}></i>
      </div>
    </div>
  })

  if (this.state.myGameUser)
    var myCanvas =  <div className={'canvas-wrapper ' + this.state.myGameUser.id}>
      <canvas className="canvas upper"
              width="300"
              height="300"
              id={this.state.myGameUser.id + '-upper'}>
      </canvas>
      <canvas className="canvas lower"
              width="300"
              height="300"
              id={this.state.myGameUser.id + '-lower'}>
      </canvas>
      <div className="painty-area"></div>
      <div className="brush" id={this.state.myGameUser.id + '-brush'}>
        <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png"
             alt=""/>
      </div>
      <div className="cursor" id={this.state.myGameUser.id + '-cursor'}>
        <i style={cursorStyle}></i>
      </div>
    </div>


//=================================================
  console.log(this.state.myGameUser)

  return <div>
    <div>
      {myCanvas}
      {oppenontCanvases}
    </div>
    {tools}
  </div>
};


