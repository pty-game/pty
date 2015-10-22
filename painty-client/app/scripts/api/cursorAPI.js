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

var Constants = require('../constants/constants');

module.exports = function(id, autoMove) {
  var cursor = $('#' + id);

  if (autoMove == null) {
    autoMove = true;
  }

  var obj = {
    setPosition: setPosition,
    hide: hide,
    show: show
  };

  __extends(cursor, obj);

  return cursor

  function show() {
    return cursor.animate({
      opacity: 1
    }, 200);
  };

  function hide() {
    return cursor.animate({
      opacity: 0
    }, 200);
  };

  function setPosition(x, y) {
    cursor.css('left', x);
    return cursor.css('top', y);
  };
};
