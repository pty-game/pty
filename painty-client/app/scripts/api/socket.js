import WS from '../helpers/ws'

WS.init({ baseUrlSocket: 'ws:localhost:3001' })

function _getDefaultHeaders() {
  return {
    'Authorization': 'Bearer ' + $.cookie('userId')
  }
}

function init() {

}

function request(options, success, error) {
  options.headers = _.defaults(options.headers || {}, _getDefaultHeaders())

  return WS.instance.request(options, success, error)
}

function on(action, callback) {
  return WS.instance.on(action, callback)
}

function off(action, callback) {
  return WS.instance.off(action, callback)
}

module.exports = {
  request,
  on,
  off
}
