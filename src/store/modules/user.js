import { VueCookieNext } from 'vue-cookie-next'

// initial state
const state = {
  userToken: null,
  sideMenuOpen: false,
}

// getters
const getters = {}

// actions
const actions = {
  loginUser(context, userToken) {
    context.commit('setUserToken', userToken)
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
