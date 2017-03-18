import url from 'url';
import jwt from 'jsonwebtoken';
import { wsGenerateMessage, wsParseMessage } from 'pty-common/wsMessage';
import { JWT_SECRET } from '../config';

export default class WS {
  constructor(wsServer) {
    this.wsServer = wsServer;
    this.messageEventMap = {};
    this.userIdSocketMap = {};

    this.connectionHandler();
  }

  connectionHandler() {
    this.wsServer.on('connection', (socket) => {
      const { query: { token } } = url.parse(socket.upgradeReq.url, true);
      const userData = jwt.verify(token, JWT_SECRET);

      this.userIdSocketMap[userData.id] = socket;

      this.assignEvents(socket);

      socket.send(wsGenerateMessage('SUBSCRIBED', userData));
    });
  }

  on(type, cb) {
    this.messageEventMap[type] = (payload, token) => {
      const userData = jwt.verify(token, JWT_SECRET);

      if (userData) {
        cb(payload, userData);
      }
    };
  }

  assignEvents(socket) {
    socket.on('message', (message) => {
      const { type, payload, token } = wsParseMessage(message);

      if (this.messageEventMap[type]) {
        this.messageEventMap[type](payload, token);
      }
    });
  }
}
