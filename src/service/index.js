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
  getThreads: async function () {
    // BEGIN HERE: testing done to call unauthorized api
    // TODO: leverage use of axios interceptor to inject authorization header
    // TODO: change all script tag in vue to script setup
    // TODO: Login page
    return await axios.get("/threads").then((x) => x.data);
  },

  getUserThreads: async function () {
    return await axios.get("/threads/userThreads").then((x) => x.data);
  },

  getThread: async function (id) {
    return await axios.get(`/threads/${id}`).then((x) => x.data);
  },

  getNewToken: async function () {
    return await axios.get("/users/newToken").then((x) => x.data);
  },

  registerToken: async function (token) {
    return await axios
      .post(`/auth/register`, {
        password: token,
      })
      .then((x) => x.data);
  },
};
