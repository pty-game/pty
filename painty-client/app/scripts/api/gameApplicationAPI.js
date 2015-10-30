import Q from 'q'

module.exports = {
  create,
  on,
  off
};

var prefix = ''

function create(userId, data) {
  var url = prefix + '/gameapplication/user/' + userId

  var defer = Q.defer()
  socket.post(url, data, defer.resolve, defer.reject)

  return defer.promise
}

function on(callback) {
  socket.on('gameapplication', callback)
}

function off() {
  socket.off('gameapplication')
}