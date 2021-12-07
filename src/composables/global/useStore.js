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
  userThreads: [],
  threads: [],
  isLoggedIn: true,
  channels: [
    {
      title: "Welcome to class of 2020",
      thread_count: 30,
      comment_count: 200,
      default: 2779817052,
      recent: 2582008951,
      activity: 387093808,
      starred: 124871588,
    },
    {
      title: "Welcome to class of 2021",
      thread_count: 31,
      comment_count: 201,
      default: 128551075,
      recent: 1697155068,
      activity: 2025152521,
      starred: 3801509991,
    },
  ],
  majorError: "",
});

// Mutations
function setUserThreads(userThreads) {
  state.value.userThreads = userThreads;
}

function setThreads(threads) {
  state.value.threads = threads;
}

function setAuth(response) {
  state.auth = [{ ...response }];
}

// Actions
async function loadThreads() {
  const threads = await ThreadService.getThreads();
  setThreads(threads);
}

async function loadUserThreads() {
  const userThreads = await ThreadService.getThreads();
  setUserThreads(userThreads);
}

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
  });
}

async function registerUser(username, password) {
  return await ThreadService.registerUser(username, password, {
    pseudonym: getPseudonym.value.pseudonym,
    token: getPseudonym.value.token,
  }).then((x) => {
    updateUserToken(x.tokens);
    updateAuth(x.user.pseudonyms);
  });
}

async function logout() {
  VueCookieNext.keys().forEach((cookie) => VueCookieNext.removeCookie(cookie));
  state.auth = [...[]];
  return await loadNewPseudonym();
}

// Getters
const getUserThreads = computed(() => state.userThreads);

const getThreads = computed(() => state.threads);

const getUserToken = computed(() =>
  VueCookieNext.getCookie("access_user_token")
);
const getChannels = computed(() => state.channels);

const getLoggedInStatus = () =>
  VueCookieNext.getCookie("pseudonym") && VueCookieNext.getCookie("token");

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

  getUserThreads,
  getThreads,
  getUserToken,
  getChannels,
  getLoggedInStatus,
  getPseudonym,
  getMajorError,
};
