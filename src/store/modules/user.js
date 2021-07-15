import { VueCookieNext } from 'vue-cookie-next'
import axios from 'axios'

// initial state
const state = {
  userToken: null,
  sideMenuOpen: false,
  currentTopic: {},
  currentThread: {},
  currentTopicThreads: [],
  userTopics: [],
  userThreads: [],
  auth: {
    refreshingCall: false,
    isRefreshing: false,
    pingInterval: null,
  },
}

// getters
const getters = {}

// actions
const actions = {
  async loginUser(context, userToken) {
    const res = await axios.post(`${process.env.API_SERVER_URL}/v1/auth/register`, {
      password: userToken,
    })

    context.commit('setUserToken', userToken)
    context.commit('setSideMenuOpen', true)
    VueCookieNext.setCookie('user_access_token', res.data.tokens.access.token)
    VueCookieNext.setCookie('user_refresh_token', res.data.tokens.refresh.token)
  },
  logout() {
    VueCookieNext.keys().forEach((cookie) => VueCookieNext.removeCookie(cookie))
  },
  async reloadUserTopics(context) {
    const res = await axios.get(`${process.env.API_SERVER_URL}/v1/topics/userTopics`)
    context.commit('setUserTopics', res.data)
  },
  async reloadUserThreads(context) {
    const res = await axios.get(`${process.env.API_SERVER_URL}/v1/threads/userThreads`)
    context.commit('setUserThreads', res.data)
  },
  setPingRequest(context) {
    context.commit('setPingRequest')
  },
  setCurrentThreadFollowed(context, data) {
    context.commit('setCurrentThreadFollowed', data.status)
    axios
      .post(`${process.env.API_SERVER_URL}/v1/threads/follow`, {
        status: data.status,
        threadId: data.threadId,
      })
      .then(() => context.dispatch('reloadUserThreads'))
  },
}

// mutations
const mutations = {
  setUserToken(state, userToken) {
    state.userToken = userToken
  },
  setSideMenuOpen(state, open) {
    state.sideMenuOpen = open
    VueCookieNext.setCookie('user_side_menu_status', open)
  },
  setCurrentTopic(state, topic) {
    state.currentTopic = topic
  },
  setUserTopics(state, topics) {
    state.userTopics = topics
  },
  setRefreshingState(state, value) {
    state.auth.isRefreshing = value
  },
  setRefreshingCall(state, call) {
    state.auth.refreshingCall = call
  },
  setUserThreads(state, threads) {
    state.userThreads = threads
  },
  setCurrentThread(state, thread) {
    state.currentThread = thread
  },
  setCurrentTopicThreads(state, threads) {
    state.currentTopicThreads = threads
  },
  setPingRequest(state) {
    if (state.auth.pingInterval === null) {
      const pingInterval = setInterval(function () {
        axios.defaults.headers.common['Authorization'] = ''
        axios.get(`${process.env.API_SERVER_URL}/v1/auth/ping`)
      }, 50000)

      state.auth.pingInterval = pingInterval
    }
  },
  setCurrentThreadFollowed(state, value) {
    state.currentThread.followed = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
