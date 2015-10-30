import Q from 'q'

module.exports = {
  subscribe,
  on,
  addAction
};

var prefix = ''

function subscribe(gameId, data) {
  var url = prefix + '/game/' + gameId + '/subscribe'

  var defer = Q.defer()
  socket.get(url, data, defer.resolve, defer.reject)

  return defer.promise
}

function addAction(gameId, data) {
  var url = prefix + '/game/' + gameId

  var defer = Q.defer()
  socket.request({
    headers: {
      userId: 11
    },
    method: 'put',
    url,
    data
  }, defer.resolve, defer.reject)

  return defer.promise
}

function on() {
  var defer = Q.defer()
  socket.on('game', defer.resolve)

  return defer.promise
}