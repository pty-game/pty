import Q from 'q'
import socket from './socket.js'

module.exports = {
  subscribe,
  unsubscribe,
  on,
  off
};

var prefix = ''

function subscribe() {
  var url = prefix + '/user/subscribe'

  var defer = Q.defer()
  socket.request({
    method: 'get',
    url,
  }, function(data, jwres) {
    if (jwres.error) {
      defer.reject(jwres.error);
    }

    defer.resolve(data);
  })

  return defer.promise
}

function unsubscribe() {
  var url = prefix + '/user/unsubscribe'

  var defer = Q.defer()
  socket.request({
    method: 'get',
    url,
  }, function(data, jwres) {
    if (jwres.error) {
      defer.reject(jwres.error);
    }

    defer.resolve(data);
  })

  return defer.promise
}

function on(callback) {
  return socket.on('user', callback)
}

function off() {
  return socket.off('user')
}