import { io, Socket } from "socket.io-client";
/**
 * Singleton Socket Service class
 */
class SocketioService {
  _socketInstance = null;
  constructor() {
    if (!this._socketInstance) {
      /**
       * initialize socket connection and connect
       */
      const setupSocketConnection = () => {
        const socketServerUrl = new URL(
          import.meta.env.VITE_WEBSOCKET_SERVER_URL
        );

        let path = "";
        if (socketServerUrl.pathname) {
          path = socketServerUrl.pathname.replace(/\/+$/, "") + "/socket.io";
        } else {
          path = "/socket.io";
        }
        this._socketInstance = io(
          `${socketServerUrl.protocol}//${socketServerUrl.host}`,
          {
            path: path,
          }
        );
      };
      setupSocketConnection();
    }
  }

  getInstance() {
    return this._socketInstance;
  }

  addMessageHandler(onMessageHandler) {
    // New message bind
    this._socketInstance.on("message:new", onMessageHandler);
  }

  addThreadHandler(onThreadHandler) {
    // New Thread bind
    this._socketInstance.on("thread:new", onThreadHandler);
  }

  addThreadUpdateHandler(onThreadHandler) {
    // Update Thread bind
    this._socketInstance.on("thread:update", onThreadHandler);
  }

  addVotesHandler(onVoteHandler) {
    // New vote bind
    this._socketInstance.on("vote:new", onVoteHandler);
  }

  disconnectTopic() {
    this._socketInstance.emit("topic:disconnect");
    this.disconnect();
  }

  disconnectThread() {
    this._socketInstance.emit("thread:disconnect");
    this.disconnect();
  }

  disconnect() {
    if (this._socketInstance) {
      this._socketInstance.disconnect();
      this._socketInstance = null;
    }
  }

  sendMessage(payload) {
    this._socketInstance.emit("message:create", payload);
  }

  joinThread(payload) {
    this._socketInstance.emit("thread:join", payload);
  }

  joinTopic(payload) {
    this._socketInstance.emit("topic:join", payload);
  }
}

export default SocketioService;
