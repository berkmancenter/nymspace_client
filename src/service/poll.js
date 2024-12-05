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
  },
  // Corresponds to listPolls
  getPolls: async function (channelId) {
    return await axios
      .get(`/polls`, {
        params: {
          topic: channelId
        }
      })
      .then((x) => x.data)
  },
  // Corresponds to inspectPoll
  getPoll: async function (pollId) {
    return await axios
      .get(`/polls/${pollId}`, {
        params: {
          topic: pollId
        }
      })
      .then((x) => x.data)
  },
  getPollResponses: async function (pollId) {
    return await axios
      .get(`/polls/${pollId}/responses`, {
        params: {
          topic: pollId
        }
      })
      .then((x) => x.data)
  },
  respondPoll: async function (payload) {
    return await axios
      .post(`/polls/${payload.pollId}/respond`, {
        ...payload
      })
      .then((x) => x.data)
  },
  getPollResponseCounts: async function (pollId) {
    return await axios
      .get(`/polls/${pollId}/responseCounts`, {
        params: {
          topic: pollId
        }
      })
      .then((x) => x.data)
  }
}
