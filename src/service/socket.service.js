import { io } from "socket.io-client";

class SocketioService {
  socket;
  constructor() {}

  /**
   * initialize socket connection and connect
   *
   * @param {*} onMessageHandler: method to handle new
   * messages received
   */
  setupSocketConnection(onMessageHandler) {
    const socketServerUrl = new URL(import.meta.env.VITE_WEBSOCKET_SERVER_URL);

    let path = "";
    if (socketServerUrl.pathname) {
      path = socketServerUrl.pathname.replace(/\/+$/, "") + "/socket.io";
    } else {
      path = "/socket.io";
    }

    this.socket = io(`${socketServerUrl.protocol}//${socketServerUrl.host}`, {
      path: path,
    });

    // New message bind
    this.socket.on("message:new", onMessageHandler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(payload) {
    this.socket.emit("message:create", payload);
  }

  joinThread(payload) {
    this.socket.emit("thread:join", payload);
  }
}

export default new SocketioService();
