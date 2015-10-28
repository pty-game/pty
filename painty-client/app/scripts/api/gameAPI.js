import Q from 'q'

module.exports = {
  subscribe,
  on,
  addAction
};

var prefix = ''

function subscribe(gameId, data) {
  var url = prefix + '/game/' + gameId + '/subscribe'

  var def = Q.defer()
  socket.get(url, data, function() {
    def.resolve(arguments)
  }, function() {
    def.reject(arguments)
  })

  return def.promise
}

function addAction(gameId, data) {
  var url = prefix + '/game/' + gameId

  var def = Q.defer()
  socket.get(url, data, function() {
    def.resolve(arguments)
  }, function() {
    def.reject(arguments)
  })

  return def.promise
}

function on() {
  var def = Q.defer()
  socket.on('game', function(response) {
    def.resolve(response)
  })

  return def.promise
}