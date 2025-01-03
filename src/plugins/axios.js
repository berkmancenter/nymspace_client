import axios from 'axios'
import { VueCookieNext } from 'vue-cookie-next'

axios.defaults.headers.common.Authorization = `Bearer ${VueCookieNext.getCookie('access_token')}`

export function refreshToken() {
  const refreshingCall = axios
    .post(`${import.meta.env.VITE_API_SERVER_URL}/v1/auth/refresh-tokens`, {
      refreshToken: VueCookieNext.getCookie('refresh_token')
    })
    .then((res) => {
      VueCookieNext.setCookie('access_token', res.data.access.token)
      VueCookieNext.setCookie('refresh_token', res.data.refresh.token)

      axios.defaults.headers.common.Authorization = `Bearer ${res.data.access.token}`

      return Promise.resolve(true)
    })

  return refreshingCall
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null

    if (
      status === 401 &&
      !error.config.repeating &&
      !(error.response.request.responseURL.endsWith('login') || error.response.request.responseURL.endsWith('register'))
    ) {
      if (error.request.responseURL.includes('refresh-token')) {
        return Promise.reject(error)
      }

      return refreshToken().then(() => {
        error.config.headers.Authorization = `Bearer ${VueCookieNext.getCookie('access_token')}`
        error.config.baseURL = undefined
        error.config.repeating = true
        return axios.request(error.config)
      })
    }

    return Promise.reject(error)
  }
)

const customAxios = axios
export default customAxios
