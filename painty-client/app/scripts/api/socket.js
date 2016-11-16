function _getDefaultHeaders() {
  return {
    'Authorization': 'Bearer ' + $.cookie('userId')
  }
}

function request(options, success, error) {
  options.headers = _.defaults(options.headers || {}, _getDefaultHeaders())

  return ws.request(options, success, error)
}

function on(action, callback) {
  return ws.on(action, callback)
}

function off(action, callback) {
  return ws.off(action, callback)
}

module.exports = {
  request,
  on,
  off
}
