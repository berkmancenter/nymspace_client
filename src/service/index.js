import axios from "../plugins/axios";

if ("VITE_API_SERVER_URL" in import.meta.env) {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_SERVER_URL +
    "/" +
    import.meta.env.VITE_API_VERSION;
} else {
  axios.defaults.baseURL = "";
}

export default {
  setAuth: function (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  createChannel: async function (payload) {
    return await axios
      .post("/topics", {
        ...payload,
      })
      .then((x) => x.data);
  },

  updateChannel: async function (payload) {
    return await axios
      .put("/topics", {
        ...payload,
      })
      .then((x) => x.data);
  },

  createThread: async function (payload) {
    return await axios
      .post("/threads", {
        ...payload,
      })
      .then((x) => x.data);
  },

  followThread: async function (payload) {
    return await axios
      .post("/threads/follow", {
        ...payload,
      })
      .then((x) => x.data);
  },

  followChannel: async function (payload) {
    return await axios
      .post("/topics/follow", {
        ...payload,
      })
      .then((x) => x.data);
  },

  createMessage: async function (payload) {
    return await axios
      .post("/messages/", {
        ...payload,
      })
      .then((x) => x.data);
  },

  upvote: async function (id) {
    return await axios.post(`messages/${id}/upvote`).then((x) => x.data);
  },

  downvote: async function (id) {
    return await axios.post(`messages/${id}/downvote`).then((x) => x.data);
  },

  getChannel: async function (id) {
    return await axios.get(`/topics/${id}`).then((x) => x.data);
  },

  getChannels: async function () {
    return await axios.get("/topics").then((x) => x.data);
  },

  getUserChannels: async function () {
    return await axios.get("/topics/userTopics").then((x) => x.data);
  },

  getPublicChannels: async function (token) {
    return await axios.get(`/topics/public/${token}`).then((x) => x.data);
  },

  getThreads: async function (channelId) {
    return await axios.get(`/threads/topic/${channelId}`).then((x) => x.data);
  },

  getUserThreads: async function (channelId) {
    return await axios.get(`/threads/userthreads`).then((x) => x.data);
  },

  getMessages: async function (threadId) {
    return await axios.get(`/messages/${threadId}`).then((x) => x.data);
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

  getPseudonyms: async function () {
    return await axios.get("/users/pseudonyms").then((x) => x.data);
  },

  registerToken: async function (token) {
    return await axios
      .post(`/auth/register`, {
        password: token,
      })
      .then((x) => x.data);
  },

  getUser: async function (id) {
    return await axios.get(`/users/user/${id}`).then((x) => x.data);
  },

  updateUser: async function (payload) {
    return await axios
      .put(`/users`, {
        ...payload,
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

  forgotPassword: async function (email) {
    return await axios
      .post(
        "/auth/forgotPassword",
        {
          email,
        },
        { timeout: 10 * 1000 }
      )
      .then((x) => x.data);
  },

  resetPassword: async function (payload) {
    return await axios.post("/auth/resetPassword", payload).then((x) => x.data);
  },

  registerUser: async function (payload) {
    return await axios.post(`/auth/register`, payload).then((x) => x.data);
  },

  registerOnce: async function (auth) {
    return await axios
      .post(`/auth/register`, {
        ...auth,
      })
      .then((x) => x.data);
  },

  registerNewPseudonym: async function (payload) {
    return await axios
      .post(`/users/pseudonyms`, {
        ...payload,
      })
      .then((x) => x.data);
  },

  activatePseudonym: async function (payload) {
    return await axios
      .put(`/users/pseudonyms/activate`, {
        ...payload,
      })
      .then((x) => x.data);
  },

  deletePseudonym: async function (id) {
    return await axios.delete(`/users/pseudonyms/${id}`).then((x) => x.data);
  },

  deleteChannel: async function (id) {
    return await axios.delete(`/topics/${id}`).then((x) => x.data);
  },
  deleteThread: async function (id) {
    return await axios.delete(`/deleteThread/${id}`).then((x) => x.data);
  },
};
