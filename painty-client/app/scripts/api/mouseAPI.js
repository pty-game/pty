var Constants, onMouse, _getCoords;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)) child[key] = parent[key];
  }
  function ctor() {
    this.constructor = child;
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};

Constants = require('../constants/constants');

_getCoords = function(e) {
  var offset = this.offset()

  return {
    x: e.clientX - offset.left + $(document).scrollLeft(),
    y: e.clientY - offset.top + $(document).scrollTop()
  };
};

onMouse = function(event, callback) {
  var target;
  target = event === 'down' || event === 'over' || event === 'out' ? this : $(document);
  target['mouse' + event]((function(e) {
    if (event === 'down' && e.which !== 1) {
      return;
    }
    return callback(this._getCoords(e));
  }).bind(this));
  return this;
};

module.exports = function(id) {
  var obj, paintyArea;
  paintyArea = $(id);
  obj = {
    _getCoords: _getCoords,
    onMouse: onMouse
  };
  return __extends(paintyArea, obj);
};