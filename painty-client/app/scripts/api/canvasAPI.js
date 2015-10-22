var Constants, EventEmitter, checkStatesActions, drawing, makeAction, onChange, redo, renderFromImage, renderFromState, setMode, startDraw, stopDraw, undo, vow, _actionsQueueChanged, _addState, _makeAction;
Constants = require('../constants/constants');
EventEmitter = require('events').EventEmitter;
vow = require('vow');
_addState = function(state) {
  var countSplice, startIndex, statesIsFull, undoActive;
  undoActive = this._stateObj.index < this._stateObj.states.length - 1;
  statesIsFull = this._stateObj.states.length >= Constants.STATES_LENGTH;
  if (statesIsFull && !undoActive) {
    this._stateObj.statesReserve = _.union(this._stateObj.statesReserve, this._stateObj.states.splice(0, 1));
    if (this._stateObj.statesReserve.length > Constants.STATES_LENGTH) {
      this._stateObj.statesReserve.splice(0, 1);
    }
  }
  if (undoActive) {
    countSplice = this._stateObj.states.length - 1 - this._stateObj.index;
    this._stateObj.states.splice(this._stateObj.index + 1, countSplice);
    startIndex = this._stateObj.statesReserve.length - countSplice;
    this._stateObj.states = _.union(this._stateObj.statesReserve.splice(startIndex, countSplice), this._stateObj.states);
  }
  if (!statesIsFull) {
    this._stateObj.index++;
  }
  if (undoActive) {
    this._stateObj.index = this._stateObj.states.length;
  }
  this._stateObj.states.push(state);
  return this.checkStatesActions();
};
_makeAction = function(action, options) {
  var beforeActionPromise;
  if (options == null) {
    options = {};
  }
  this.beforeMakeActionProcess = true;
  beforeActionPromise = options.before ? options.before(action) : void 0;
  if (!beforeActionPromise) {
    beforeActionPromise = vow.resolve();
  }
  return beforeActionPromise.then((function() {
    var actionPromise, defer;
    this.beforeMakeActionProcess = false;
    if (action.instrument === 'undo' || action.instrument === 'redo') {
      defer = vow.defer();
      setTimeout((function() {
        this[action.instrument]();
        return defer.resolve();
      }).bind(this), Constants.DO_ACTIONS_DELAY);
      actionPromise = defer.promise();
    } else {
      actionPromise = this.renderFromState(action, options);
    }
    return actionPromise.then((function() {
      return this._eventEmitter.emit('actionsQueueChange');
    }).bind(this));
  }).bind(this));
};
_actionsQueueChanged = function() {
  var item;
  if (this.drawingInProcess || this.beforeMakeActionProcess || !this._actionsQueue.length) {
    return;
  }
  item = this._actionsQueue.shift();
  return this._makeAction(item.action, item.options);
};
makeAction = function(action, options) {
  if (options == null) {
    options = {};
  }
  this._actionsQueue.push({
    action: action,
    options: options
  });
  return this._eventEmitter.emit('actionsQueueChange');
};
checkStatesActions = function() {
  this._stateObj.enabled.undo = this._stateObj.index > 0;
  return this._stateObj.enabled.redo = this._stateObj.index < this._stateObj.states.length - 1;
};
setMode = function(property, mode) {
  this._mode[property] = mode;
  return this;
};
undo = function() {
  if (!this._stateObj.enabled.undo) {
    return;
  }
  this._lowerCanvas.clearRect(0, 0, this._lowerCanvasElem.width(), this._lowerCanvasElem.height());
  this.renderFromImage(this._stateObj.states[--this._stateObj.index].image);
  this.checkStatesActions();
  return this._changeCallback({
    instrument: 'undo'
  });
};
redo = function() {
  if (!this._stateObj.enabled.redo) {
    return;
  }
  this._lowerCanvas.clearRect(0, 0, this._lowerCanvasElem.width(), this._lowerCanvasElem.height());
  this.renderFromImage(this._stateObj.states[++this._stateObj.index].image);
  this.checkStatesActions();
  return this._changeCallback({
    instrument: 'redo'
  });
};
renderFromImage = function(image) {
  if (image) {
    return this._lowerCanvas.drawImage(image, 0, 0);
  }
};
renderFromState = function(state, options) {
  var defer, pathIndex, pathsInterval, pathsIntervalTime;
  if (options == null) {
    options = {};
  }
  defer = vow.defer();
  pathIndex = 0;
  pathsIntervalTime = state.time / state.coordsArr.length;
  _.each(state, (function(item, key) {
    if (key === 'coodrsArr') {
      return;
    }
    return this.setMode(key, item);
  }).bind(this));
  pathsInterval = setInterval((function() {
    if (pathIndex === 0) {
      this.startDraw(state.coordsArr[pathIndex]);
    } else if (pathIndex > 1 && pathIndex <= state.coordsArr.length - 1) {
      this.drawing(state.coordsArr[pathIndex]);
    }
    options.pathRendered(state.coordsArr[pathIndex]);
    if (pathIndex === state.coordsArr.length - 1) {
      clearInterval(pathsInterval);
      this.stopDraw();
      return defer.resolve();
    }
    return pathIndex++;
  }).bind(this), pathsIntervalTime);
  return defer.promise();
};
onChange = function(changeCallback) {
  if (changeCallback == null) {
    changeCallback = function() {
    };
  }
  return this._changeCallback = changeCallback;
};
startDraw = function(coords) {
  var color, dateObject, i, intervalRandomPoint, lastX, lastY, radius;
  this.drawingInProcess = true;
  dateObject = new Date();
  switch (this._mode.instrument) {
    case "brush":
      this._upperCanvas.fillStyle = this._upperCanvas.strokeStyle = this._mode.color;
      this._upperCanvas.lineWidth = this._mode.size;
      this._lowerCanvas.globalAlpha = this._mode.opacity;
      this._upperCanvasElem.css('opacity', this._mode.opacity);
      this._upperCanvas.lineJoin = "round";
      this._upperCanvas.lineCap = "round";
      if (this._mode.size === 1) {
        coords.x += .5;
        coords.y += .5;
      }
      this._upperCanvas.beginPath();
      this._upperCanvas.arc(coords.x, coords.y, this._mode.size / 2, 0, 2 * Math.PI, false);
      this._upperCanvas.fill();
      this._upperCanvas.beginPath();
      this._upperCanvas.moveTo(coords.x, coords.y);
      this._addState({
        instrument: 'brush',
        size: this._mode.size,
        color: this._mode.color,
        opacity: this._mode.opacity,
        coordsArr: [
          {
            x: coords.x,
            y: coords.y
          }
        ],
        time: dateObject.getTime()
      });
      break;
    case "eraser":
      mainContext.beginPath();
      mainContext.clearRect(scope.coordinates.X - scope.toolActive.size / 2, scope.coordinates.Y - scope.toolActive.size / 2, scope.toolActive.size, scope.toolActive.size);
      scope.history.push([1, scope.toolActive.size, [scope.coordinates.X, scope.coordinates.Y], dateObject.getTime()]);
      break;
    case "spray":
      lastX = scope.coordinates.X;
      lastY = scope.coordinates.Y;
      radius = scope.toolActive.size / 2;
      context.fillStyle = scope.toolSettings.color;
      mainContext.globalAlpha = canvas.style.opacity = 1;
      scope.history.push([5, radius, scope.toolSettings.color, [lastX, lastY, 1], dateObject.getTime()]);
      i = 0;
      while (i < constants.sprayIterationNumber) {
        scope.paintedRandomPoint(context, scope.toolActive.size / 2, scope.coordinates.X, scope.coordinates.Y);
        i++;
      }
      intervalRandomPoint = setInterval(function() {
        var _results;
        dateObject = new Date();
        if (lastX !== scope.coordinates.X || lastY !== scope.coordinates.Y) {
          scope.history[scope.historyIndex][3].push(scope.coordinates.X, scope.coordinates.Y, 0);
        }
        scope.history[scope.historyIndex][3][scope.history[scope.historyIndex][3].length - 1]++;
        lastX = scope.coordinates.X;
        lastY = scope.coordinates.Y;
        i = 0;
        _results = [];
        while (i < constants.sprayIterationNumber) {
          scope.paintedRandomPoint(context, radius, lastX, lastY);
          _results.push(i++);
        }
        return _results;
      }, 25);
      break;
    case "line":
      context.strokeStyle = scope.toolSettings.color;
      context.lineWidth = scope.toolActive.size;
      mainContext.globalAlpha = scope.toolSettings.opacity;
      canvas.style.opacity = scope.toolSettings.opacity;
      context.lineCap = "round";
      if (scope.toolActive.size === 1) {
        scope.coordinates.X += .5;
        scope.coordinates.Y += .5;
      }
      scope.history.push([6, scope.toolActive.size, scope.toolSettings.color, scope.toolSettings.opacity - sliderSettings.line[1].min, [scope.coordinates.X, scope.coordinates.Y]]);
      cursorStartPosition.X = scope.coordinates.X;
      cursorStartPosition.Y = scope.coordinates.Y;
      break;
    case "square":
      context.strokeStyle = scope.toolSettings.color;
      mainContext.globalAlpha = scope.toolSettings.opacity;
      canvas.style.opacity = scope.toolSettings.opacity;
      context.lineJoin = "miter";
      cursorStartPosition.X = scope.coordinates.X;
      cursorStartPosition.Y = scope.coordinates.Y;
      break;
    case "circle":
      context.strokeStyle = scope.toolSettings.color;
      mainContext.globalAlpha = scope.toolSettings.opacity;
      canvas.style.opacity = scope.toolSettings.opacity;
      cursorStartPosition.X = Math.ceil(scope.coordinates.X);
      cursorStartPosition.Y = Math.ceil(scope.coordinates.Y);
      break;
    case "pipette":
      color = mainContext.getImageData(scope.coordinates.X, scope.coordinates.Y, 1, 1);
      if (color.data[0] !== 0 || color.data[1] !== 0 || color.data[2] !== 0 || color.data[3] !== 0) {
        scope.toolSettings.color = "rgb(" + color.data[0] + ", " + color.data[1] + ", " + color.data[2] + ")";
        scope.toolSettings.opacity = (1 / (255 / color.data[3])).toFixed(2);
        scope.$apply();
      }
      return;
  }
  this._lastCoords.x = coords.x;
  return this._lastCoords.y = coords.y;
};
drawing = function(coords) {
  if (!this.drawingInProcess) {
    return;
  }
  switch (this._mode.instrument) {
    case "brush":
      if (this._mode.size === 1) {
        coords.x += .5;
        coords.y += .5;
      }
      this._upperCanvas.beginPath();
      this._upperCanvas.moveTo(this._lastCoords.x, this._lastCoords.y);
      this._upperCanvas.lineTo(coords.x, coords.y);
      this._upperCanvas.stroke();
      this._stateObj.states[this._stateObj.index].coordsArr.push({
        x: coords.x,
        y: coords.y
      });
      break;
  }
  this._lastCoords.x = coords.x;
  return this._lastCoords.y = coords.y;
};
stopDraw = function() {
  var dateObject, image;
  if (!this.drawingInProcess) {
    return;
  }
  this.drawingInProcess = false;
  this._lowerCanvas.drawImage(this._upperCanvasElem[0], 0, 0);
  dateObject = new Date();
  switch (this._mode.instrument) {
    case "brush":
      this._stateObj.states[this._stateObj.index].time = dateObject.getTime() - this._stateObj.states[this._stateObj.index].time;
      break;
  }
  this._upperCanvas.clearRect(0, 0, this._upperCanvasElem.width(), this._upperCanvasElem.height());
  this._lowerCanvas.globalAlpha = 1;
  this._upperCanvasElem.css('opacity', 1);
  image = new Image;
  image.src = this._lowerCanvasElem[0].toDataURL();
  this._stateObj.states[this._stateObj.index].image = image;
  return this._changeCallback(this._stateObj.states[this._stateObj.index]);
};
module.exports = function(idUpper, idLower) {
  var obj, _mode, _stateObj;
  _mode = {
    instrument: 'brush',
    opacity: 1,
    size: 20,
    color: '#000'
  };
  _stateObj = {
    index: -1,
    states: [],
    statesReserve: [],
    enabled: {
      undo: false,
      redo: false
    }
  };
  obj = {
    _eventEmitter: new EventEmitter(),
    _upperCanvas: $('#' + idUpper)[0].getContext('2d'),
    _lowerCanvas: $('#' + idLower)[0].getContext('2d'),
    _upperCanvasElem: $('#' + idUpper),
    _lowerCanvasElem: $('#' + idLower),
    _actionsQueue: [],
    _lastCoords: {},
    _changeCallback: function() {
    },
    _actionsQueueChanged: _actionsQueueChanged,
    _mode: _mode,
    _stateObj: _stateObj,
    _addState: _addState,
    _makeAction: _makeAction,
    checkStatesActions: checkStatesActions,
    setMode: setMode,
    makeAction: makeAction,
    startDraw: startDraw,
    drawing: drawing,
    stopDraw: stopDraw,
    undo: undo,
    redo: redo,
    renderFromState: renderFromState,
    renderFromImage: renderFromImage,
    onChange: onChange
  };
  obj._eventEmitter.on('actionsQueueChange', obj._actionsQueueChanged.bind(obj));
  obj._addState({});
  return obj;
};