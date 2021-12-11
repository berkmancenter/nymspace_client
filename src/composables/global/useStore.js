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
  isLoggedIn: VueCookieNext.getCookie("access_token") !== null,
  channels: [],
  userChannels: [],
  threads: [],
  userThreads: [],
  majorError: "",
});

// Mutations
function setUserThreads(userThreads) {
  state.userThreads = userThreads;
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

function setMessages(messages) {
  state.messages = [...messages];
}

function setMessage(message) {
  state.messages.push({
    body: message.body,
    created: message.createdAt,
    id: message.id,
    owner: message.owner.id,
  });
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

async function createChannel(payload) {
  const channels = await ThreadService.createChannel(payload);
  loadChannels();
}

async function createThread(payload) {
  const threads = await ThreadService.createThread(payload);
  loadThreads(payload.topicId);
}

async function loadChannel(id) {
  return await ThreadService.getChannel(id);
}

async function loadChannels() {
  const channels = await ThreadService.getChannels();
  setChannels(channels);
}

async function loadThreads(channelId) {
  const threads = await ThreadService.getThreads(channelId);
  setThreads(threads);
}

async function loadUserThreads() {
  const userThreads = await ThreadService.getThreads();
  setUserThreads(userThreads);
}

async function loadMessages(threadId) {
  const messages = await ThreadService.getMessages(threadId);
  setMessages(messages);
}

async function postMessage(payload) {
  const message = await ThreadService.createMessage(payload);
  setMessage(message);
}

const getThread = (id) => state.threads[id];
const getChannel = (id) => {
  const channelId = state.channels.indexOf((x) => x.id === id);
  return channelId > -1 ? state.channels[channelId] : {};
};

function updateUserToken(tokens) {
  VueCookieNext.setCookie("access_token", tokens.access.token);
  VueCookieNext.setCookie("access_token_expiry", tokens.access.expires);
  VueCookieNext.setCookie("refresh_token", tokens.refresh.token);
  VueCookieNext.setCookie("refresh_token_expiry", tokens.refresh.expires);
}

function updateAuth(pseudonyms) {
  state.auth = [...pseudonyms];
  VueCookieNext.setCookie("pseudonym", getPseudonym.value.pseudonym);
  VueCookieNext.setCookie("token", getPseudonym.value.token);
  VueCookieNext.setCookie("active", getPseudonym.value.active);
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

async function loginUser(username, password) {
  return await ThreadService.loginUser(username, password).then((x) => {
    updateUserToken(x.tokens);
    updateAuth(x.user.pseudonyms);
    state.isLoggedIn = true;
  });
}

async function registerUser(username, password) {
  return await ThreadService.registerUser(username, password, {
    pseudonym: getPseudonym.value.pseudonym,
    token: getPseudonym.value.token,
  }).then((x) => {
    updateUserToken(x.tokens);
    updateAuth(x.user.pseudonyms);
    state.isLoggedIn = true;
  });
}

async function registerOnce() {
  return await ThreadService.registerOnce({
    pseudonym: getPseudonym.value.pseudonym,
    token: getPseudonym.value.token,
  }).then((x) => {
    updateUserToken(x.tokens);
    updateAuth(x.user.pseudonyms);
    state.isLoggedIn = true;
  });
}

async function logout() {
  VueCookieNext.keys().forEach((cookie) => VueCookieNext.removeCookie(cookie));
  state.auth = [...[]];
  state.isLoggedIn = false;

  return await loadNewPseudonym();
}

// Getters
const getUserThreads = computed(() => state.userThreads);

const getThreads = computed(() => state.threads);

const getUserToken = computed(() => VueCookieNext.getCookie("access_token"));

const getChannels = computed(() => state.channels);
const getMessages = computed(() => state.messages);

const getLoggedInStatus = computed(() => {
  return state.isLoggedIn;
});

const getPseudonym = computed(() =>
  state.auth.filter((x) => x.active === true).pop()
);

const getMajorError = computed(() => state.majorError);

const getAuth = computed(() => ({
  pseudonym: state.auth.pseudonym,
  token: state.auth.token,
}));

export default {
  loadThreads,
  loadUserThreads,
  updateUserToken,
  loginUser,
  loadNewPseudonym,
  registerUser,
  logout,
  loadChannels,
  loadChannel,
  loadMessages,

  registerOnce,
  createChannel,
  createThread,
  postMessage,

  getUserThreads,
  getThreads,
  getLoggedInStatus,
  getThread,
  getChannel,
  getUserToken,
  getChannels,
  getPseudonym,
  getMessages,
  getMajorError,
};
