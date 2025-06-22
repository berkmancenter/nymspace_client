import axios from '../plugins/axios'

if ('VITE_API_SERVER_URL' in import.meta.env) {
  axios.defaults.baseURL = import.meta.env.VITE_API_SERVER_URL + '/' + import.meta.env.VITE_API_VERSION
} else {
  axios.defaults.baseURL = ''
}

export default {
  setAuth: function (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  },

  createChannel: async function (payload) {
    return await axios
      .post('/topics', {
        ...payload
      })
      .then((x) => x.data)
  },

  updateChannel: async function (payload) {
    return await axios
      .put('/topics', {
        ...payload
      })
      .then((x) => x.data)
  },

  updateThread: async function (payload) {
    return await axios
      .put('/threads', {
        ...payload
      })
      .then((x) => x.data)
  },

  revealHitTheButtonHiddenMessages: async function (payload) {
    return await axios
      .put('/threads/reveal', {
        threadId: payload
      })
      .then((x) => x.data)
  },

  createThread: async function (payload) {
    return await axios
      .post('/threads', {
        ...payload
      })
      .then((x) => x.data)
  },

  followThread: async function (payload) {
    return await axios
      .post('/threads/follow', {
        ...payload
      })
      .then((x) => x.data)
  },

  followChannel: async function (payload) {
    return await axios
      .post('/topics/follow', {
        ...payload
      })
      .then((x) => x.data)
  },

  createMessage: async function (payload) {
    return await axios
      .post('/messages/', {
        ...payload
      })
      .then((x) => x.data)
  },

  vote: async function (payload) {
    return await axios.post(`messages/${payload.messageId}/vote`, payload).then((x) => x.data)
  },

  getChannel: async function (id) {
    return await axios.get(`/topics/${id}`).then((x) => x.data)
  },

  getChannels: async function () {
    return await axios.get('/topics').then((x) => x.data)
  },

  getUserChannels: async function () {
    return await axios.get('/topics/userTopics').then((x) => x.data)
  },

  getPublicChannels: async function (token) {
    return await axios.get(`/topics/public/${token}`).then((x) => x.data)
  },

  getThreads: async function (channelId) {
    return await axios.get(`/threads/topic/${channelId}`).then((x) => x.data)
  },

  getMessages: async function (threadId) {
    return await axios.get(`/messages/${threadId}`).then((x) => x.data)
  },

  getMessageReplies: async function (messageId) {
    return await axios.get(`/messages/${messageId}/replies`).then((x) => x.data)
  },

  getUserThreads: async function () {
    return await axios.get('/threads/userThreads').then((x) => x.data)
  },

  getThread: async function (id) {
    return await axios.get(`/threads/${id}`).then((x) => x.data)
  },

  getNewPseudonym: async function () {
    return await axios.get('/auth/newPseudonym').then((x) => x.data)
  },

  getPseudonyms: async function () {
    return await axios.get('/users/pseudonyms').then((x) => x.data)
  },

  registerToken: async function (token) {
    return await axios
      .post(`/auth/register`, {
        password: token
      })
      .then((x) => x.data)
  },

  getUser: async function (id) {
    return await axios.get(`/users/user/${id}`).then((x) => x.data)
  },

  updateUser: async function (payload) {
    return await axios
      .put(`/users`, {
        ...payload
      })
      .then((x) => x.data)
  },

  loginUser: async function (username, password) {
    return await axios
      .post(`/auth/login`, {
        username,
        password
      })
      .then((x) => x.data)
  },

  forgotPassword: async function (email) {
    return await axios
      .post(
        '/auth/forgotPassword',
        {
          email
        },
        { timeout: 10 * 1000 }
      )
      .then((x) => x.data)
  },

  resetPassword: async function (payload) {
    return await axios.post('/auth/resetPassword', payload).then((x) => x.data)
  },

  registerUser: async function (payload) {
    return await axios.post(`/auth/register`, payload).then((x) => x.data)
  },

  registerOnce: async function (auth) {
    return await axios
      .post(`/auth/register`, {
        ...auth
      })
      .then((x) => x.data)
  },

  registerNewPseudonym: async function (payload) {
    return await axios
      .post(`/users/pseudonyms`, {
        ...payload
      })
      .then((x) => x.data)
  },

  activatePseudonym: async function (payload) {
    return await axios
      .put(`/users/pseudonyms/activate`, {
        ...payload
      })
      .then((x) => x.data)
  },

  deletePseudonym: async function (id) {
    return await axios.delete(`/users/pseudonyms/${id}`).then((x) => x.data)
  },

  deleteChannel: async function (id) {
    return await axios.delete(`/topics/${id}`).then((x) => x.data)
  },

  deleteThread: async function (id) {
    return await axios.delete(`/threads/${id}`).then((x) => x.data)
  },

  loadConfig: async function () {
    return await axios.get('/config').then((x) => x.data)
  },

  updateDataExportPreference: async function (optOut) {
    const userId = this.getUserId()
    return await axios
      .put(`/users/user/${userId}/preferences/export`, { optOut })
      .then((x) => x.data)
  },

  getDataExportPreference: async function () {
    const userId = this.getUserId()
    return await axios.get(`/users/user/${userId}/preferences/export`).then((x) => x.data)
  },

  getExportAuditLog: async function () {
    const userId = this.getUserId()
    return await axios.get(`/users/user/${userId}/exports`).then((x) => x.data)
  },

  getUserId: function() {
    const store = JSON.parse(localStorage.getItem('vuex') || '{}')
    return store?.user?.id || ''
  },

  exportThread: async function (threadId, format = 'docx') {
    return await axios
      .get(`/export/thread/${threadId}`, {
        params: { format },
        responseType: 'blob',
        timeout: 5 * 60 * 1000,
        headers: {
          'Accept': format === 'csv' ? 'application/zip' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        const contentDisposition = response.headers['content-disposition']
        console.log('Response headers:', response.headers)
        console.log('Content-Disposition:', contentDisposition)

        let filename = ''

        if (contentDisposition) {
          let filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
          if (!filenameMatch) {
            filenameMatch = contentDisposition.match(/filename=([^;]+)/)
          }
          if (filenameMatch) {
            filename = filenameMatch[1].trim()
          }
        }

        if (!filename) {
          const dateStr = new Date().toISOString().split('T')[0]
          filename = `thread-export-${dateStr}.${format === 'csv' ? 'zip' : 'docx'}`
        }

        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        return { success: true }
      })
  }
}
