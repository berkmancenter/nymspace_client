import { reactive, computed } from "vue";
import { VueCookieNext } from "vue-cookie-next";
import ThreadService from "../../service";

// State
const state = reactive({
  auth: [
    {
      pseudonym: VueCookieNext.getCookie("pseudonym"),
      token: VueCookieNext.getCookie("token"),
      active: true,
    },
  ],
  uid: VueCookieNext.getCookie("uid"),
  isLoggedIn: VueCookieNext.getCookie("access_token") !== null,
  isGuest: VueCookieNext.getCookie("is_guest") !== null,
  channels: [],
  userChannels: [],
  threads: [],
  userThreads: [],
  majorError: "",
  messages: [],
});

// Mutations
function setUserThreads(userThreads) {
  state.userThreads = userThreads;
}

function setUserChannels(userChannels) {
  state.userChannels = userChannels;
}

function setThreads(threads) {
  state.threads = [...threads];
}

function setAuth(response) {
  state.auth = [{ ...response }];
}

function setChannels(channels) {
  state.channels = [...channels];
}

function removeChannel(id) {
  let index = state.channels.findIndex((x) => x.id === id);
  if (index > -1) {
    state.channels.splice(index, 1);
  }
}

function setMessages(messages) {
  state.messages = [...messages];
}

function setMessage(message) {
  state.messages.push(message);
}

function updateMessage(message) {
  const messageId = state.messages.findIndex((x) => x.id === message.id);
  if (messageId > -1) {
    state.messages.splice(messageId, 1, message);
  } else {
    state.messages.push(message);
  }
}

function addChannel(channel) {
  const channelId = state.channels.indexOf((x) => x.id === channel.id);
  if (channelId > -1) {
    state.channels.splice(channelId, 1, channel);
  } else {
    state.channels.push(channel);
  }
}

// Actions

function clearMessages() {
  setMessages([]);
}

async function createChannel(payload) {
  const channels = await ThreadService.createChannel(payload);
  loadChannels();
}

async function followChannel(payload) {
  await ThreadService.followChannel(payload);
  loadUserChannels();
}

async function updateChannel(payload) {
  await ThreadService.updateChannel(payload);
  loadChannels();
}

async function deleteChannel(id) {
  await ThreadService.deleteChannel(id);
  removeChannel(id);
}

async function createThread(payload) {
  const threads = await ThreadService.createThread(payload);
  loadThreads(payload.topicId);
}

async function followThread(payload) {
  await ThreadService.followThread(payload);
  loadUserThreads();
}

async function loadUser() {
  return await ThreadService.getUser(state.uid);
}

async function updateUser(payload) {
  return await ThreadService.updateUser({
    ...payload,
    userId: state.uid,
  });
}

async function loadChannel(id) {
  return await ThreadService.getChannel(id);
}

async function loadUserChannels() {
  if (!getLoggedInStatus.value) await registerOnce();
  const userChannels = await ThreadService.getUserChannels();
  setUserChannels(userChannels);
}

async function loadChannels() {
  if (getLoggedInStatus.value) {
    const channels = await ThreadService.getChannels();
    setChannels(channels);
  } else {
    const channels = await ThreadService.getPublicChannels(
      getActivePseudonym.value.token
    );
    setChannels(channels);
  }
}

async function loadUserThreads() {
  if (!getLoggedInStatus.value) await registerOnce();
  const userThreads = await ThreadService.getUserThreads();
  setUserThreads(userThreads);
}

async function loadThreads(channelId) {
  if (!getLoggedInStatus.value) await registerOnce();
  const threads = await ThreadService.getThreads(channelId);
  setThreads(threads);
}

async function loadThread(threadId) {
  return await ThreadService.getThread(threadId);
}

async function loadMessages(threadId) {
  const messages = await ThreadService.getMessages(threadId);
  setMessages(messages);
}

/**
 * Create message using API and update
 * messages array with response
 */
async function postMessage(payload) {
  const message = await ThreadService.createMessage(payload);
  setMessage(message);
}

async function upvote(id) {
  const response = await ThreadService.upvote(id);
  updateMessage(response);
}

/**
 * Let only non guest user downvote a message
 * @param {*} id : message id to cast down vote
 */
async function downvote(id) {
  if (!getGuestStatus.value) {
    const response = await ThreadService.downvote(id);
    updateMessage(response);
  }
}

/**
 * Update messages array with ws response
 */
async function addMessage(message) {
  setMessage(message);
}

const getThread = (id) => {
  const threadId = state.threads.findIndex((x) => x.id === id);
  return threadId > -1 ? state.threads[threadId] : {};
};

const getChannel = (id) => {
  const channelId = state.channels.findIndex((x) => x.id === id);
  return channelId > -1 ? state.channels[channelId] : {};
};

function updateUserToken(tokens) {
  ThreadService.setAuth(tokens.access.token);
  VueCookieNext.setCookie("access_token", tokens.access.token);
  VueCookieNext.setCookie("access_token_expiry", tokens.access.expires);
  VueCookieNext.setCookie("refresh_token", tokens.refresh.token);
  VueCookieNext.setCookie("refresh_token_expiry", tokens.refresh.expires);
}

function updateAuth(pseudonyms) {
  state.auth = [...pseudonyms];
  VueCookieNext.setCookie("pseudonym", getActivePseudonym.value.pseudonym);
  VueCookieNext.setCookie("token", getActivePseudonym.value.token);
  VueCookieNext.setCookie("active", getActivePseudonym.value.active);
  VueCookieNext.removeCookie("is_guest");
  state.isGuest = false;
}

async function loadNewPseudonym(username, password) {
  return await ThreadService.getNewPseudonym().then(
    (response) => setAuth({ ...response, active: true }),
    (err) => {
      setMajorError("Cannot load pseudonym. Contact administrator.");
      return { isError: true, ...err };
    }
  );
}

async function updateAuthTokens(data) {
  updateUserToken(data.tokens);
  updateAuth(data.user.pseudonyms);
  VueCookieNext.setCookie("uid", data.user.id);
  state.uid = data.user.id;
  state.isLoggedIn = true;
}

async function loginUser(username, password) {
  return await ThreadService.loginUser(username, password).then((data) => {
    updateAuthTokens(data);
  });
}

async function forgotPassword(email) {
  return await ThreadService.forgotPassword(email);
}

async function resetPassword(password, token) {
  return await ThreadService.resetPassword({
    password,
    token,
  });
}

async function registerUser(username, password, email) {
  let payload = {
    username: username,
    password: password,
    pseudonym: getActivePseudonym.value.pseudonym,
    token: getActivePseudonym.value.token,
  };
  if (email.trim().length > 0) {
    payload = { ...payload, email };
  }
  return await ThreadService.registerUser(payload).then((data) => {
    updateAuthTokens(data);
  });
}

async function registerOnce() {
  return await ThreadService.registerOnce({
    pseudonym: getActivePseudonym.value.pseudonym,
    token: getActivePseudonym.value.token,
  }).then((data) => {
    updateAuthTokens(data);
    VueCookieNext.setCookie("is_guest", "true");
    state.isGuest = true;
  });
}

async function createNewPseudonym() {
  if (getPseudonyms.value.length < 5) {
    return await ThreadService.getNewPseudonym().then((response) =>
      ThreadService.registerNewPseudonym(response).then((data) =>
        updateAuth(data)
      )
    );
  }
}

async function deletePseudonym(id) {
  if (getActivePseudonym.value?._id !== id) {
    await ThreadService.deletePseudonym(id);
  }
}

async function activatePseudonym(token) {
  const isGuest = state.isGuest;
  if (token === null) {
    token = VueCookieNext.getCookie("token");
  }
  let pseudonyms = await ThreadService.activatePseudonym({
    token,
  });
  updateAuth(pseudonyms);
  if (isGuest) {
    VueCookieNext.setCookie("is_guest", "true");
    state.isGuest = true;
  }
}

async function loadPseudonyms() {
  const isGuest = state.isGuest;
  let pseudonyms = await ThreadService.getPseudonyms();
  updateAuth(pseudonyms);
  if (isGuest) {
    VueCookieNext.setCookie("is_guest", "true");
    state.isGuest = true;
  }
}

async function logout() {
  await loadNewPseudonym();
  await registerOnce();
}

// Getters
const getUserThreads = computed(() => state.userThreads);
const getUserChannels = computed(() => state.userChannels);

const getThreads = computed(() => state.threads);

const getUserToken = computed(() => VueCookieNext.getCookie("access_token"));

const getChannels = computed(() => state.channels);
const getMessages = computed(() => state.messages);

const getLoggedInStatus = computed(() => {
  return state.isLoggedIn;
});

const getGuestStatus = computed(() => {
  return state.isGuest;
});

const getActivePseudonym = computed(() =>
  state.auth.filter((x) => x.active === true).pop()
);

const getPseudonyms = computed(() => state.auth);

const getMajorError = computed(() => state.majorError);

const getAuth = computed(() => ({
  pseudonym: state.auth.pseudonym,
  token: state.auth.token,
}));

const getId = computed(() => state.uid);

export default {
  getThread,
  loadThreads,
  loadUserThreads,
  loadThread,
  loadUserThreads,
  createThread,
  followThread,
  getUserThreads,
  getThreads,

  getChannel,
  loadChannels,
  loadUserChannels,
  loadChannel,
  createChannel,
  followChannel,
  updateChannel,
  deleteChannel,

  logout,
  loginUser,
  registerUser,
  updateUserToken,
  getGuestStatus,
  getLoggedInStatus,
  getUserToken,
  getId,
  loadUser,
  updateUser,

  loadMessages,
  clearMessages,
  postMessage,
  getMessages,
  upvote,
  downvote,

  registerOnce,
  createNewPseudonym,
  loadNewPseudonym,
  deletePseudonym,
  activatePseudonym,

  postMessage,
  addMessage,

  getThreads,
  getLoggedInStatus,
  getChannels,
  getUserChannels,
  getGuestStatus,

  getThread,
  getChannel,

  getUserToken,
  getChannels,

  loadPseudonyms,
  getPseudonyms,
  getActivePseudonym,

  getMajorError,

  forgotPassword,
  resetPassword,
};
