import React from 'react'

module.exports = function() {
  var cursorStyle = {
    width: this.state.brush.size,
    height: this.state.brush.size
  };

  if (this.state.myGameUser && !this.state.myGameUser.is_estimator)
    var tools = <div className="tools">
        <div>
          <a onClick={this.undo}>Undo</a>
          <a onClick={this.redo}>Redo</a>
        </div>
        <div id="brush-width" class="some-slider"></div>
        <div id="brush-opacity" class="some-slider"></div>
        <input class="" id="brush-color"/>
      </div>
  else
    var tools = <div className="tools"></div>

  return <div>
    <div>
      <div className="canvas-wrapper 0">
        <canvas className="canvas upper" width="300" height="300"
                id="0-upper"></canvas>
        <canvas className="canvas lower" width="300" height="300"
                id="0-lower"></canvas>
        <div className="painty-area"></div>
        <div className="brush" id="0-brush">
          <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png"
               alt=""/>
        </div>
        <div className="cursor" id="0-cursor">
          <i style={cursorStyle}></i>
        </div>
      </div>
      <div className="canvas-wrapper 1">
        <canvas className="canvas upper" width="300" height="300"
                id="1-upper"></canvas>
        <canvas className="canvas lower" width="300" height="300"
                id="1-lower"></canvas>
        <div className="brush" id="1-brush">
          <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png"
               alt=""/>
        </div>
      </div>
    </div>
    {tools}
  </div>
};


