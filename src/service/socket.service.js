import { v4 as uuidv4 } from 'uuid';
import { io, Socket } from "socket.io-client";
import { VueCookieNext } from "vue-cookie-next";
import { refreshToken } from '../plugins/axios';

/**
 * Singleton Socket Service class
 */
class SocketioService {
  _requestCache = {};
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

      // set up cache
      this._requestCache = {};
    }
  }

  getInstance() {
    return this._socketInstance;
  }

  addDisconnectHandler(onDisconnectHandler){
    this._socketInstance.on("disconnect", onDisconnectHandler);
  }

  addMessageHandler(finalOnMessageHandler) {
    const onMessageHandler = (data) => {
      if (data.request && data.request in this._requestCache) {
        const { resolve } = this._requestCache[data.request];
        resolve(finalOnMessageHandler(data));
        delete this._requestCache[data.request];
      } else {
        finalOnMessageHandler(data);
      }
    };

    // New message bind
    this._socketInstance.off("message:new", onMessageHandler);
    this._socketInstance.on("message:new", onMessageHandler); 
  }

  addThreadHandler(onThreadHandler) {
    // New Thread bind
    this._socketInstance.off("thread:new", onThreadHandler);
    this._socketInstance.on("thread:new", onThreadHandler);
  }

  addThreadUpdateHandler(onThreadHandler) {
    // Update Thread bind
    this._socketInstance.off("thread:update", onThreadHandler);
    this._socketInstance.on("thread:update", onThreadHandler);
  }

  addVotesHandler(onVoteHandler) {
    // New vote bind
    this._socketInstance.off("vote:new", onVoteHandler);
    this._socketInstance.on("vote:new", onVoteHandler);
  }

  async sendMessage(payload) {
    const request = uuidv4();

    return new Promise((resolve, reject) => {
      this._requestCache[request] = { resolve, reject, payload };
      this._socketInstance.emit("message:create", { ...payload, request });
    });
  }

  addErrorHandler() {
    const onErrorHandler = async (data) => {
      if (data.request) {
        const { reject, resolve, payload } = this._requestCache[data.request];

        if (data.error === "jwt expired") {
          await refreshToken();
          await this.sendMessage({
            ...payload,
            token: VueCookieNext.getCookie("access_token"),
          });

          resolve();
        } else {
          reject(data.error);
        }

        delete this._requestCache[data.request];
      }
    };

    // New error bind
    this._socketInstance.off("error", onErrorHandler);
    this._socketInstance.on("error", onErrorHandler); 
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

  joinThread(payload) {
    this._socketInstance.emit("thread:join", payload);
  }

  joinTopic(payload) {
    this._socketInstance.emit("topic:join", payload);
  }

  joinUser(payload) {
    this._socketInstance.emit("user:join", payload);
  }

  onConnect(onConnectHandler) {
    this._socketInstance.on("connect", onConnectHandler);
  }
}

export default SocketioService;
