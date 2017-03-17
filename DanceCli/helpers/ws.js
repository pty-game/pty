export default class WS {
  static init(...args) {
    WS.instance = new WS(...args);

    return WS.instance;
  }

  constructor({ baseUrlSocket, token, wsGenerateMessage, wsParseMessage }) {
    this.messageMap = {};
    this.baseUrlSocket = baseUrlSocket;
    this.token = token;
    this.wsGenerateMessage = wsGenerateMessage;
    this.wsParseMessage = wsParseMessage;
  }

  on(type, cb) {
    this.messageMap[type] = cb;
  }

  connect() {
    this.socket = new WebSocket(`${this.baseUrlSocket}/$token=${this.token}`);

    this.assign();
  }

  emit(type, payload) {
    this.socket.send(this.wsGenerateMessage(type, { ...payload, token: this.token }));
  }

  assign() {
    this.socket.onmessage = ({ data }) => {
      const { type, payload } = this.wsParseMessage(data);

      if (this.messageMap[type]) {
        this.messageMap[type](payload);
      }
    };
  }
}
