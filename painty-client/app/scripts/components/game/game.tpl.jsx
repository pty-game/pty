import React from 'react'

module.exports = function() {
  var cursorStyle = {
    width: this.state.brush.size,
    height: this.state.brush.size
  };

  return <div>
    <div>
      <div className="canvas-wrapper my">
        <canvas className="canvas upper" width="300" height="300" id="my-upper"></canvas>
        <canvas className="canvas lower" width="300" height="300" id="my-lower"></canvas>
        <div className="painty-area"></div>
        <div className="brush" id="my-brush">
          <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png" alt=""/>
        </div>
        <div className="cursor" id="my-cursor">
          <i style={cursorStyle}></i>
        </div>
      </div>
      <div className="canvas-wrapper opponent">
        <canvas className="canvas upper" width="300" height="300" id="opponent-upper"></canvas>
        <canvas className="canvas lower" width="300" height="300" id="opponent-lower"></canvas>
        <div className="brush" id="opponent-brush">
          <img src="http://iconizer.net/files/Shimmer_Icons/orig/brush.png" alt=""/>
        </div>
      </div>
    </div>
    <div className="tools">
      <div>
        <a onClick={this.undo}>Undo</a>
        <a onClick={this.redo}>Redo</a>
      </div>
      <div id="brush-width" class="some-slider"></div>
      <div id="brush-opacity" class="some-slider"></div>
      <input class="" id="brush-color"/>
    </div>
  </div>
};


