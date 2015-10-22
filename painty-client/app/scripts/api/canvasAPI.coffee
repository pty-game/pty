Constants = require '../constants/constants'
EventEmitter = require('events').EventEmitter
vow = require('vow')

_addState = (state)->
  undoActive = @_stateObj.index < @_stateObj.states.length - 1
  statesIsFull = @_stateObj.states.length >= Constants.STATES_LENGTH

  if statesIsFull && !undoActive
    @_stateObj.statesReserve = _.union(@_stateObj.statesReserve, @_stateObj.states.splice 0, 1)

    if @_stateObj.statesReserve.length > Constants.STATES_LENGTH
      @_stateObj.statesReserve.splice 0, 1

  if undoActive
    countSplice = @_stateObj.states.length - 1 - @_stateObj.index
    @_stateObj.states.splice @_stateObj.index + 1, countSplice

    startIndex = @_stateObj.statesReserve.length - countSplice

    @_stateObj.states = _.union(@_stateObj.statesReserve.splice(startIndex, countSplice), @_stateObj.states)

  if !statesIsFull
    @_stateObj.index++

  if undoActive
    @_stateObj.index = @_stateObj.states.length

  @_stateObj.states.push state

  @checkStatesActions()

_makeAction = (action, options = {})->
  @beforeMakeActionProcess = true

  beforeActionPromise = if options.before then options.before(action) else undefined
  if !beforeActionPromise then beforeActionPromise = vow.resolve()

  beforeActionPromise.then (->
    @beforeMakeActionProcess = false

    if (action.instrument == 'undo' || action.instrument == 'redo')
      defer = vow.defer()

      setTimeout (->
        @[action.instrument]()
        defer.resolve()
      ).bind(@), Constants.DO_ACTIONS_DELAY

      actionPromise = defer.promise()
    else
      actionPromise = @renderFromState(action, options)

    actionPromise.then (->
      @_eventEmitter.emit 'actionsQueueChange'
    ).bind(@)
  ).bind(@)

_actionsQueueChanged = ->
  if @drawingInProcess || @beforeMakeActionProcess || !@_actionsQueue.length then return

  item = @_actionsQueue.shift()
  @_makeAction item.action, item.options

makeAction = (action, options = {})->
  @_actionsQueue.push action: action, options: options
  @_eventEmitter.emit 'actionsQueueChange'

checkStatesActions = ->
  @_stateObj.enabled.undo = @_stateObj.index > 0
  @_stateObj.enabled.redo = @_stateObj.index < @_stateObj.states.length - 1

setMode = (property, mode)->
  @_mode[property] = mode
  @

undo = ->
  if !@_stateObj.enabled.undo
    return

  @_lowerCanvas.clearRect(0, 0, @_lowerCanvasElem.width(), @_lowerCanvasElem.height())

  @renderFromImage(@_stateObj.states[--@_stateObj.index].image)
  @checkStatesActions()

  @_changeCallback instrument: 'undo'

redo = ->
  if !@_stateObj.enabled.redo
    return

  @_lowerCanvas.clearRect(0, 0, @_lowerCanvasElem.width(), @_lowerCanvasElem.height())

  @renderFromImage(@_stateObj.states[++@_stateObj.index].image)
  @checkStatesActions()

  @_changeCallback instrument: 'redo'

renderFromImage = (image)->
  if image
    @_lowerCanvas.drawImage(image, 0, 0)

renderFromState = (state, options = {})->
  defer = vow.defer()

  pathIndex = 0
  pathsIntervalTime = state.time / state.coordsArr.length

  _.each state, ((item, key)->
    if key == 'coodrsArr' then return

    @setMode key, item
  ).bind(@)

  pathsInterval = setInterval (->
    if pathIndex == 0
      @startDraw state.coordsArr[pathIndex]
    else if pathIndex > 1 && pathIndex <= state.coordsArr.length - 1
      @drawing state.coordsArr[pathIndex]


    options.pathRendered(state.coordsArr[pathIndex])

    if pathIndex == state.coordsArr.length - 1
      clearInterval pathsInterval

      @stopDraw()

      return defer.resolve()

    pathIndex++
  ).bind(@), pathsIntervalTime

  defer.promise()

onChange = (changeCallback = ->)->
  @_changeCallback = changeCallback


# ================ Drawing =================

startDraw = (coords) ->
  @drawingInProcess = true

  dateObject = new Date()

  switch @_mode.instrument
    when "brush"
      @_upperCanvas.fillStyle = @_upperCanvas.strokeStyle = @_mode.color
      @_upperCanvas.lineWidth = @_mode.size
      @_lowerCanvas.globalAlpha = @_mode.opacity
      @_upperCanvasElem.css('opacity', @_mode.opacity)
      @_upperCanvas.lineJoin = "round"
      @_upperCanvas.lineCap = "round"

      if @_mode.size is 1
        coords.x += .5
        coords.y += .5

      @_upperCanvas.beginPath()
      @_upperCanvas.arc coords.x, coords.y, @_mode.size / 2, 0, 2 * Math.PI, false
      @_upperCanvas.fill()
      @_upperCanvas.beginPath()
      @_upperCanvas.moveTo coords.x, coords.y

      @_addState {
        instrument: 'brush'
        size: @_mode.size
        color: @_mode.color
        opacity: @_mode.opacity
        coordsArr: [
          {
            x: coords.x
            y: coords.y
          }
        ]
        time: dateObject.getTime()
      }

      break
    when "eraser"
      mainContext.beginPath()
      mainContext.clearRect scope.coordinates.X - scope.toolActive.size / 2, scope.coordinates.Y - scope.toolActive.size / 2, scope.toolActive.size, scope.toolActive.size
      scope.history.push [1, scope.toolActive.size, [scope.coordinates.X, scope.coordinates.Y], dateObject.getTime()]
      break
    when "spray"
      lastX = scope.coordinates.X
      lastY = scope.coordinates.Y
      radius = scope.toolActive.size / 2
      context.fillStyle = scope.toolSettings.color
      mainContext.globalAlpha = canvas.style.opacity = 1
      scope.history.push [5, radius, scope.toolSettings.color, [lastX, lastY, 1], dateObject.getTime()]
      i = 0

      while i < constants.sprayIterationNumber
        scope.paintedRandomPoint context, scope.toolActive.size / 2, scope.coordinates.X, scope.coordinates.Y
        i++
      intervalRandomPoint = setInterval(->
        dateObject = new Date()
        scope.history[scope.historyIndex][3].push scope.coordinates.X, scope.coordinates.Y, 0  if lastX isnt scope.coordinates.X or lastY isnt scope.coordinates.Y
        scope.history[scope.historyIndex][3][scope.history[scope.historyIndex][3].length - 1]++
        lastX = scope.coordinates.X
        lastY = scope.coordinates.Y

        i = 0

        while i < constants.sprayIterationNumber
          scope.paintedRandomPoint context, radius, lastX, lastY
          i++
      , 25)
      break
    when "line"
      context.strokeStyle = scope.toolSettings.color
      context.lineWidth = scope.toolActive.size
      mainContext.globalAlpha = scope.toolSettings.opacity
      canvas.style.opacity = scope.toolSettings.opacity
      context.lineCap = "round"
      if scope.toolActive.size is 1
        scope.coordinates.X += .5
        scope.coordinates.Y += .5
      scope.history.push [6, scope.toolActive.size, scope.toolSettings.color,
                          scope.toolSettings.opacity - sliderSettings.line[1].min,
                          [scope.coordinates.X, scope.coordinates.Y]]
      cursorStartPosition.X = scope.coordinates.X
      cursorStartPosition.Y = scope.coordinates.Y
      break
    when "square"
      context.strokeStyle = scope.toolSettings.color
      mainContext.globalAlpha = scope.toolSettings.opacity
      canvas.style.opacity = scope.toolSettings.opacity
      context.lineJoin = "miter"
      cursorStartPosition.X = scope.coordinates.X
      cursorStartPosition.Y = scope.coordinates.Y
      break
    when "circle"
      context.strokeStyle = scope.toolSettings.color
      mainContext.globalAlpha = scope.toolSettings.opacity
      canvas.style.opacity = scope.toolSettings.opacity
      cursorStartPosition.X = Math.ceil(scope.coordinates.X)
      cursorStartPosition.Y = Math.ceil(scope.coordinates.Y)
      break
    when "pipette"
      color = mainContext.getImageData(scope.coordinates.X, scope.coordinates.Y, 1, 1)
      if color.data[0] isnt 0 or color.data[1] isnt 0 or color.data[2] isnt 0 or color.data[3] isnt 0
        scope.toolSettings.color = "rgb(" + color.data[0] + ", " + color.data[1] + ", " + color.data[2] + ")"
        scope.toolSettings.opacity = (1 / (255 / color.data[3])).toFixed(2)
        scope.$apply()
      return

  @_lastCoords.x = coords.x
  @_lastCoords.y = coords.y

drawing = (coords)->
  if !@drawingInProcess then return

  switch @_mode.instrument
    when "brush"
      if @_mode.size is 1
        coords.x += .5
        coords.y += .5

      @_upperCanvas.beginPath()
      @_upperCanvas.moveTo @_lastCoords.x, @_lastCoords.y
      @_upperCanvas.lineTo coords.x, coords.y
      @_upperCanvas.stroke()

      @_stateObj.states[@_stateObj.index].coordsArr.push
        x: coords.x
        y: coords.y
      break

    when "eraser"
      bc = scope.coordinates.X - cursorLast.x
      ab = scope.coordinates.Y - cursorLast.y
      ac = Math.sqrt((Math.pow(ab, 2) + Math.pow(bc, 2)))
      cos = Math.sqrt(1 / (1 + Math.pow(ab / bc, 2)))
      sin = Math.sqrt(1 - Math.pow(cos, 2))
      x = undefined
      y = undefined
      i = undefined
      i = ac
      while i > 0
        if bc > 0
          x = cursorLast.x + i * cos
        else if bc < 0
          x = cursorLast.x - i * cos
        else
          x = cursorLast.x
        if ab > 0
          y = cursorLast.y + i * sin
        else if ab < 0
          y = cursorLast.y - i * sin
        else
          y = cursorLast.y
        mainContext.clearRect Math.floor(x) - scope.toolActive.size / 2, Math.floor(y) - scope.toolActive.size / 2, scope.toolActive.size, scope.toolActive.size
        i--
      scope.history[0][2].push scope.coordinates.X, scope.coordinates.Y
      break
    when "line"
      if scope.toolActive.size is 1
        scope.coordinates.X -= .5
        scope.coordinates.Y -= .5
      context.beginPath()
      context.clearRect 0, 0, canvas.clientWidth, canvas.clientHeight
      context.moveTo cursorStartPosition.X, cursorStartPosition.Y
      context.lineTo scope.coordinates.X, scope.coordinates.Y
      context.stroke()
      break
    when "square"
      width = scope.coordinates.X - cursorStartPosition.X
      height = scope.coordinates.Y - cursorStartPosition.Y
      directionXFactor = (if width >= 0 then 1 else -1)
      directionYFactor = (if height >= 0 then 1 else -1)
      sideLength = Math.max(Math.abs(width), Math.abs(height))
      size = (if sideLength < scope.toolActive.size then Math.ceil(sideLength / 2) else scope.toolActive.size)
      context.lineWidth = size  unless context.lineWidth is size
      toolData.width = (directionXFactor * (sideLength - size)) or 1
      toolData.height = (directionYFactor * (sideLength - size)) or 1
      toolData.X = cursorStartPosition.X + directionXFactor * size / 2
      toolData.Y = cursorStartPosition.Y + directionYFactor * size / 2
      context.beginPath()
      context.clearRect 0, 0, canvas.clientWidth, canvas.clientHeight
      toolData.size = size
      context.strokeRect toolData.X, toolData.Y, toolData.width, toolData.height
      break
    when "circle"
      toolData.radius = Math.ceil(Math.max(Math.abs(scope.coordinates.X - cursorStartPosition.X),
        Math.abs(scope.coordinates.Y - cursorStartPosition.Y)))
      size = (if toolData.radius < scope.toolActive.size / 2 then Math.ceil(toolData.radius * 2) else scope.toolActive.size)
      context.lineWidth = size  unless context.lineWidth is size
      toolData.size = size
      context.beginPath()
      context.clearRect 0, 0, canvas.clientWidth, canvas.clientHeight
      context.arc cursorStartPosition.X, cursorStartPosition.Y, toolData.radius, 0, Math.PI * 2, true
      context.stroke()
      break

  @_lastCoords.x = coords.x
  @_lastCoords.y = coords.y

stopDraw = ->
  if !@drawingInProcess then return

  @drawingInProcess = false

  @_lowerCanvas.drawImage @_upperCanvasElem[0], 0, 0
  dateObject = new Date()

  switch @_mode.instrument
    when "brush"
      @_stateObj.states[@_stateObj.index].time = dateObject.getTime() - @_stateObj.states[@_stateObj.index].time
      break
    when "eraser"
      scope.history[scope.historyIndex][3] = dateObject.getTime() - scope.history[scope.historyIndex][3]
      block = scope.history[scope.historyIndex]
      history = decToBin(block[0], "tool") + decToBin(block[1], "size") + decToBin(block[3],
        "time") + decToBin(block[2], "coordinate")
      scope.history[scope.historyIndex] = strToAsci(history)
      break
    when "spray"
      scope.history[scope.historyIndex][4] = dateObject.getTime() - scope.history[scope.historyIndex][4]
      block = scope.history[scope.historyIndex]
      color = block[2].replace(/[^\d,]/g, "").split(",")
      history = decToBin(block[0], "tool") + decToBin(block[1], "size") + decToBin([color[0], color[1], color[2]],
        "color") + decToBin(block[4], "time") + decToBin(block[3], "coordinate")
      scope.history[scope.historyIndex] = strToAsci(history)
      clearInterval intervalRandomPoint
      break
    when "line"
      scope.history[scope.historyIndex][4].push scope.coordinates.X, scope.coordinates.Y
      block = scope.history[scope.historyIndex]
      color = block[2].replace(/[^\d,]/g, "").split(",")
      history = decToBin(block[0], "tool") + decToBin(block[1], "thickness") + decToBin([color[0], color[1], color[2]],
        "color") + decToBin(block[3], "alpha") + decToBin(block[4], "coordinate")
      scope.history[scope.historyIndex] = strToAsci(history)
      break
    when "square"
      color = scope.toolSettings.color.replace(/[^\d,]/g, "").split(",")
      width = Math.abs(toolData.width)
      height = Math.abs(toolData.height)
      toolData.X -= width  if toolData.width < 0
      toolData.Y -= height  if toolData.height < 0
      history = decToBin(7, "tool") + decToBin(toolData.size, "thickness") + decToBin(width, "width") + decToBin(height,
        "height") + decToBin([color[0], color[1], color[2]],
        "color") + decToBin(scope.toolSettings.opacity - sliderSettings.square[1].min, "alpha") + decToBin([toolData.X,
                                                                                                            toolData.Y],
        "coordinate")
      scope.history[scope.historyIndex] = strToAsci(history)
      break
    when "circle"
      color = scope.toolSettings.color.replace(/[^\d,]/g, "").split(",")
      history = decToBin(8, "tool") + decToBin(toolData.size, "thickness") + decToBin(toolData.radius,
        "radius") + decToBin([color[0], color[1], color[2]],
        "color") + decToBin(scope.toolSettings.opacity - sliderSettings.circle[1].min,
        "alpha") + decToBin([cursorStartPosition.X, cursorStartPosition.Y], "coordinate")
      scope.history[scope.historyIndex] = strToAsci(history)
      break

  @_upperCanvas.clearRect 0, 0, @_upperCanvasElem.width(), @_upperCanvasElem.height()
  @_lowerCanvas.globalAlpha = 1
  @_upperCanvasElem.css 'opacity', 1

  image = new Image
  image.src = @_lowerCanvasElem[0].toDataURL()

  @_stateObj.states[@_stateObj.index].image = image

  @_changeCallback(@_stateObj.states[@_stateObj.index])

module.exports = (idUpper, idLower)->
  _mode = {
    instrument: 'brush'
    opacity: 1
    size: 20
    color: '#000'
  }

  _stateObj =
    index: -1
    states: [],
    statesReserve: []
    enabled:
      undo: false
      redo: false

  obj =
    _eventEmitter: new EventEmitter()
    _upperCanvas: $('#' + idUpper)[0].getContext('2d')
    _lowerCanvas: $('#' + idLower)[0].getContext('2d')
    _upperCanvasElem: $('#' + idUpper)
    _lowerCanvasElem: $('#' + idLower)
    _actionsQueue: []
    _lastCoords: {}
    _changeCallback: ()->
    _actionsQueueChanged: _actionsQueueChanged
    _mode: _mode
    _stateObj: _stateObj
    _addState: _addState
    _makeAction: _makeAction
    checkStatesActions: checkStatesActions
    setMode: setMode
    makeAction: makeAction
    startDraw: startDraw
    drawing: drawing
    stopDraw: stopDraw
    undo: undo
    redo: redo
    renderFromState: renderFromState
    renderFromImage: renderFromImage
    onChange: onChange

  obj._eventEmitter.on 'actionsQueueChange', obj._actionsQueueChanged.bind(obj)

  obj._addState({})

  obj
