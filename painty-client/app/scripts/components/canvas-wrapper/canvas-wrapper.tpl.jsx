import React from 'react'
import {Button, Input} from 'react-bootstrap'

module.exports = function() {
  var gameUser = this.props.gameUser

  if (this.props.isMyGameUser && !this.props.gameUser.is_estimator && this.props.gameUser.brush)
    var cursorStyle = {
      width: this.props.gameUser.brush.size,
      height: this.props.gameUser.brush.size
    };
  
  if (this.props.myGameUser)
    return <div className={'canvas-wrapper ' + gameUser.id}>
      <canvas className="canvas upper"
              width="300"
              height="300"
              id={gameUser.id + '-upper'}>
      </canvas>
      <canvas className="canvas lower"
              width="300"
              height="300"
              id={gameUser.id + '-lower'}>
      </canvas>
      <div className="painty-area"></div>
      <div className="brush" id={gameUser.id + '-brush'}>
        <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png"
             alt=""/>
      </div>
      <div className="cursor" id={gameUser.id + '-cursor'}>
        <i style={cursorStyle}></i>
      </div>
    </div>
  else
    return <div className={'canvas-wrapper ' + gameUser.id}>
      <canvas className="canvas upper"
              width="300"
              height="300"
              id={gameUser.id + '-upper'}>
      </canvas>
      <canvas className="canvas lower"
              width="300"
              height="300"
              id={gameUser.id + '-lower'}>
      </canvas>
      <div className="painty-area"></div>
      <div className="brush" id={gameUser.id + '-brush'}>
        <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png"
             alt=""/>
      </div>
      <div className="cursor" id={gameUser.id + '-cursor'}>
        <i style={cursorStyle}></i>
      </div>
    </div>
};
