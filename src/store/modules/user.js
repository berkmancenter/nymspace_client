import { VueCookieNext } from 'vue-cookie-next'
import axios from 'axios'

// initial state
const state = {
  userToken: null,
  sideMenuOpen: false,
  currentTopic: {},
  userTopics: [],
  userThreads: [],
  refreshingCall: false,
  isRefreshing: false,
}

// getters
const getters = {}

// actions
const actions = {
  async loginUser(context, userToken) {
    context.commit('setUserToken', userToken)
    const res = await axios.post(`${process.env.API_SERVER_URL}/v1/auth/register`, {
      password: userToken,
    })
    VueCookieNext.setCookie('user_access_token', res.data.tokens.access.token)
    VueCookieNext.setCookie('user_refresh_token', res.data.tokens.refresh.token)
  },
  async reloadUserTopics(context) {
    const res = await axios.get(`${process.env.API_SERVER_URL}/v1/topics/userTopics`)
    context.commit('setUserTopics', res.data)
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
    state.isRefreshing = value
  },
  setRefreshingCall(state, call) {
    state.refreshingCall = call
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
