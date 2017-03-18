import { wsGenerateMessage, wsParseMessage } from 'pty-common/wsMessage';

export default class WS {
  static init(...args) {
    WS.instance = new WS(...args);

    return WS.instance;
  }

  constructor({ baseUrlSocket, token }) {
    this.messageEventMap = {};
    this.baseUrlSocket = baseUrlSocket;
    this.token = token;
  }

  on(type, cb) {
    this.messageEventMap[type] = cb;
  }

  connect() {
    this.socket = new WebSocket(`${this.baseUrlSocket}/?token=${this.token}`);

    this.assign();
  }

  send(type, payload) {
    this.socket.send(wsGenerateMessage(type, payload, this.token));
  }

  assign() {
    this.socket.onmessage = ({ data }) => {
      const { type, payload } = wsParseMessage(data);

      if (this.messageEventMap[type]) {
        this.messageEventMap[type](payload);
      }
    };
  }
}
