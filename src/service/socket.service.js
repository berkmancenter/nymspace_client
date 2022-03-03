import { io } from "socket.io-client";
class SocketioService {
  socket;
  constructor() {}

  /**
   * initialize socket connection and connect
   */
  setupSocketConnection() {
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
  }

  addMessageHandler(onMessageHandler) {
    // New message bind
    this.socket.on("message:new", onMessageHandler);
  }

  addThreadHandler(onThreadHandler) {
    // New Thread bind
    this.socket.on("thread:new", onThreadHandler);
  }

  addVotesHandler(onVoteHandler) {
    // New vote bind
    this.socket.on("vote:new", onVoteHandler);
  }

  disconnectTopic() {
    this.socket.emit("topic:disconnect");
    this.disconnect();
  }

  disconnectThread() {
    this.socket.emit("thread:disconnect");
    this.disconnect();
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

  joinTopic(payload) {
    this.socket.emit("topic:join", payload);
  }
}

export default new SocketioService();
