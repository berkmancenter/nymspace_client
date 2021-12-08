import axios from "../plugins/axios";
import { VueCookieNext } from "vue-cookie-next";

if ("VITE_API_SERVER_URL" in import.meta.env) {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_SERVER_URL +
    "/" +
    import.meta.env.VITE_API_VERSION;
} else {
  axios.defaults.baseURL = "";
}

axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${VueCookieNext.getCookie("access_token")}`;

export default {
  createChannel: async function (payload) {
    return await axios
      .post("/topics", {
        ...payload,
      })
      .then((x) => x.data);
  },

  getChannels: async function () {
    return await axios.get("/topics").then((x) => x.data);
  },

  getThreads: async function () {
    return await axios.get("/threads").then((x) => x.data);
  },

  getUserThreads: async function () {
    return await axios.get("/threads/userThreads").then((x) => x.data);
  },

  getThread: async function (id) {
    return await axios.get(`/threads/${id}`).then((x) => x.data);
  },

  getNewPseudonym: async function () {
    return await axios.get("/auth/newPseudonym").then((x) => x.data);
  },

  registerToken: async function (token) {
    return await axios
      .post(`/auth/register`, {
        password: token,
      })
      .then((x) => x.data);
  },
  loginUser: async function (username, password) {
    return await axios
      .post(`/auth/login`, {
        username,
        password,
      })
      .then((x) => x.data);
  },
  registerUser: async function (username, password, auth) {
    return await axios
      .post(`/auth/register`, {
        username,
        password,
        ...auth,
      })
      .then((x) => x.data);
  },
  registerOnce: async function (auth) {
    return await axios
      .post(`/auth/register`, {
        ...auth,
      })
      .then((x) => x.data);
  },
};
