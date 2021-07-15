import axios from 'axios'
import { VueCookieNext } from 'vue-cookie-next'
import store from '@/store'

axios.defaults.headers.common['Authorization'] = `Bearer ${VueCookieNext.getCookie(
  'user_access_token'
)}`

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null

    function refreshToken() {
      if (store.state.user.isRefreshing) {
        return store.state.auth.refreshingCall
      }

      store.commit('user/setRefreshingState', true)

      const refreshingCall = axios
        .post(`${process.env.API_SERVER_URL}/v1/auth/refresh-tokens`, {
          refreshToken: VueCookieNext.getCookie('user_refresh_token'),
        })
        .then((res) => {
          VueCookieNext.setCookie('user_access_token', res.data.access.token)
          VueCookieNext.setCookie('user_refresh_token', res.data.refresh.token)

          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access.token}`

          store.commit('user/setRefreshingState', false)
          store.commit('user/setRefreshingCall', undefined)
          return Promise.resolve(true)
        })

      store.commit('user/setRefreshingCall', refreshingCall)
      return refreshingCall
    }

    if (status === 401) {
      if (error.request.responseURL.includes('refresh-token')) {
        console.log(error)
        //VueCookieNext.keys().forEach((cookie) => VueCookieNext.removeCookie(cookie))

        return Promise.reject(error)
      }

      return refreshToken().then(() => {
        error.config.headers['Authorization'] = `Bearer ${VueCookieNext.getCookie(
          'user_access_token'
        )}`
        error.config.baseURL = undefined
        return axios.request(error.config)
      })
    }

    return Promise.reject(error)
  }
)
