import Q from 'q'

module.exports = {
  create,
  on,
  off
};

var prefix = ''

function create(data) {console.log(data)
  //var url = prefix + '/gameapplication/user/' + $.cookie('userId')
  var url = prefix + '/gameapplication'

  var defer = Q.defer()
  socket.request({
    headers: {
      //userId: $.cookie('userId')
      userId: window.userId
    },
    method: 'post',
    url,
    data
  }, defer.resolve, defer.reject)

  return defer.promise
}

function on(callback) {
  socket.on('gameapplication', callback)
}

function off() {
  socket.off('gameapplication')
}