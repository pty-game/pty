import Q from 'q'

module.exports = {
  create,
  on,
};

var prefix = ''

function create(userId, data) {
  var url = prefix + '/gameapplication/user/' + userId

  var defer = Q.defer()
  socket.post(url, data, defer.resolve, defer.reject)

  return defer.promise
}

function on() {
  var defer = Q.defer()
  socket.on('gameapplication', defer.resolve)

  return defer.promise
}