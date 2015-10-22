var Canvas, Constants, Cursor, Mouse, React, Template, componentDidMount, getInitialState, redo, render, toggleDrawingMode, undo, vow;
React = require('react');
Canvas = require('../../api/canvasAPI');
Cursor = require('../../api/cursorAPI');
Mouse = require('../../api/mouseAPI');
Constants = require('../../constants/constants');
vow = require('vow');
Template = require('./game.tpl.jsx');
undo = function() {
  return this.my.canvas.undo();
};
redo = function() {
  return this.my.canvas.redo();
};
getInitialState = function() {
  return {
    brush: {}
  };
};
componentDidMount = function() {
  this.my = {
    canvas: Canvas('my-upper', 'my-lower').setMode('instrument', Constants.BRUSH),
    brush: Cursor('my-brush'),
    cursor: Cursor('my-cursor'),
    paintyArea: Mouse('.my.canvas-wrapper .painty-area')
  };
  this.opponent = {
    canvas: Canvas('opponent-upper', 'opponent-lower', false),
    brush: Cursor('opponent-brush')
  };
  this.my.paintyArea.onMouse('down', function(coords) {
    return this.my.canvas.startDraw(coords);
  }.bind(this))

  this.my.paintyArea.onMouse('move', function(coords) {
    this.my.cursor.setPosition(coords.x, coords.y);
    this.my.brush.setPosition(coords.x, coords.y);
    return this.my.canvas.drawing(coords);
  }.bind(this))

  this.my.paintyArea.onMouse('up', function(coords) {
    return this.my.canvas.stopDraw();
  }.bind(this))

  this.my.paintyArea.onMouse('over', function(coords) {
    this.my.brush.show();
    return this.my.cursor.show();
  }.bind(this))

  this.my.paintyArea.onMouse('out', function(coords) {
    this.my.brush.hide();
    return this.my.cursor.hide();
  }.bind(this));

  this.my.canvas.onChange(function(action) {
    var options = {
      pathRendered: function(path) {
        return this.opponent.brush.setPosition(path.x, path.y);
      }.bind(this),
      before: function(action) {
        var defer, path;
        if (action.instrument === 'undo' || action.instrument === 'redo') {
          return;
        }
        defer = vow.defer();
        path = action.coordsArr[0];
        this.opponent.brush.animate({
          left: path.x,
          top: path.y
        }, function() {
          return defer.resolve();
        });
        return defer.promise();
      }.bind(this)
    };

    return this.opponent.canvas.makeAction(action, options);
  }.bind(this));

  $('#brush-width').slider({
    min: Constants.BRUSH_WIDTH_MIN,
    max: Constants.BRUSH_WIDTH_MAX,
    value: Constants.BRUSH_WIDTH_INIT,
    step: Constants.BRUSH_WIDTH_STEP,
    slide: function(e, ui) {
      return this.setState(function(prev) {
        return prev.brush.size = ui.value;
      });
    }.bind(this)
  });
  $('#brush-opacity').slider({
    min: Constants.BRUSH_OPACITY_MIN,
    max: Constants.BRUSH_OPACITY_MAX,
    value: Constants.BRUSH_OPACITY_INIT,
    step: Constants.BRUSH_OPACITY_STEP,
    slide: function(e, ui) {
      return this.setState(function(prev) {
        return prev.brush.opacity = ui.value;
      });
    }.bind(this)
  });
  $('#brush-color').minicolors({
    defaultValue: Constants.BRUSH_COLOR_INIT,
    change: function(color) {
      return this.setState(function(prev) {
        return prev.brush.color = color;
      });
    }.bind(this)
  });
  return this.setState(function(prev) {
    prev.brush.size = Constants.BRUSH_WIDTH_INIT;
    prev.brush.opacity = Constants.BRUSH_OPACITY_INIT;
    return prev.brush.color = Constants.BRUSH_COLOR_INIT;
  });
};
toggleDrawingMode = function(mode) {
  return this.my.canvas.setDrawingMode(mode);
};
render = function() {
  if (this.my) {
    this.my.canvas.setMode('size', this.state.brush.size);
    this.my.canvas.setMode('opacity', this.state.brush.opacity / 100);
    this.my.canvas.setMode('color', this.state.brush.color);
  }
  return Template.apply(this);
};
module.exports = React.createClass({
  undo: undo,
  redo: redo,
  getInitialState: getInitialState,
  componentDidMount: componentDidMount,
  toggleDrawingMode: toggleDrawingMode,
  render: render
});