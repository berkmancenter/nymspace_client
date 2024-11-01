import axios from '../plugins/axios'

if ('VITE_API_SERVER_URL' in import.meta.env) {
  axios.defaults.baseURL = import.meta.env.VITE_API_SERVER_URL + '/' + import.meta.env.VITE_API_VERSION
} else {
  axios.defaults.baseURL = ''
}

export default {
  createPoll: async function (payload) {
    return await axios
      .post('/polls', {
        ...payload
      })
      .then((x) => x.data)
  }
}
