import Q from 'q'

module.exports = {
  create,
  on,
};

var prefix = ''

function create(userId, data) {
  var url = prefix + '/gameapplication/user/' + userId

  var def = Q.defer()
  socket.post(url, data, function() {
    def.resolve(arguments)
  }, function() {
    def.reject(arguments)
  })

  return def.promise
}

function on(callback) {
  socket.on('gameapplication', callback)
}