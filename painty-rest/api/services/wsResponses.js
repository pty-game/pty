module.exports = {
  message: function(message, payload) {
    if (payload === undefined) payload = {}

    return {
      message: message,
      payload: payload
    }
  }
};
