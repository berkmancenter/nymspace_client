import { reactive, computed } from 'vue'
import { VueCookieNext } from 'vue-cookie-next'
import ThreadService from '../../service'
import PollService from '../../service/poll'

// State
const state = reactive({
  auth: [
    {
      pseudonym: VueCookieNext.getCookie('pseudonym'),
      token: VueCookieNext.getCookie('token'),
      active: true
    }
  ],
  uid: VueCookieNext.getCookie('uid'),
  isLoggedIn: VueCookieNext.getCookie('access_token') !== null,
  isGuest: VueCookieNext.getCookie('is_guest') !== null,
  channels: [],
  activeChannel: null,
  activeThread: null,
  activePoll: null,
  userChannels: [],
  threads: [],
  userThreads: [],
  polls: [],
  // This can include counts or not depending on poll settings.
  pollResponses: [],
  majorError: '',
  messages: [],
  showChatOnly: false
})

// Mutations
function setUserThreads(userThreads) {
  state.userThreads = userThreads
}

function setUserChannels(userChannels) {
  state.userChannels = userChannels
}

function setThreads(threads) {
  state.threads = [...threads]
}

function setThread(thread) {
  state.threads = [...state.threads, thread]
}

function setAuth(response) {
  state.auth = [{ ...response }]
}

function setActiveChannel(channel) {
  state.activeChannel = { ...channel }
}

function setActiveThread(thread) {
  state.activeThread = { ...thread }
}

function setChannels(channels) {
  state.channels = [...channels]
}

function setMajorError(error) {
  state.majorError = { ...error }
}

function removeChannel(id) {
  const index = state.channels.findIndex((x) => x.id === id)
  if (index > -1) {
    state.channels.splice(index, 1)
  }
}

function removeThread(id) {
  const index = state.threads.findIndex((x) => x.id === id)
  if (index > -1) {
    state.threads.splice(index, 1)
  }
}

function setMessages(messages) {
  state.messages = [...messages]
}

function setMessage(message) {
  state.messages.push(message)
}

function updateMessage(message) {
  const messageId = state.messages.findIndex((x) => x.id === message.id)
  if (messageId > -1) {
    state.messages.splice(messageId, 1, message)
  } else {
    state.messages.push(message)
  }
}

function setShowChatOnly(value) {
  state.showChatOnly = value
}

function upsertThread(thread) {
  const threadId = state.threads.findIndex((x) => x.id === thread.id)
  if (threadId > -1) {
    state.threads.splice(threadId, 1, thread)
  } else {
    state.threads.push(thread)
  }
  if (getActiveThread.value.id === thread.id) {
    setActiveThread(thread)
  }
}

// Actions

function clearMessages() {
  setMessages([])
}

async function createChannel(payload) {
  await ThreadService.createChannel(payload)
  loadChannels()
}

async function followChannel(payload) {
  await ThreadService.followChannel(payload)
  loadUserChannels()
}

async function updateChannel(payload) {
  await ThreadService.updateChannel(payload)
  loadChannels()
}

async function deleteChannel(id) {
  await ThreadService.deleteChannel(id)
  removeChannel(id)
}

async function createThread(payload) {
  await ThreadService.createThread(payload)
}

async function followThread(payload) {
  await ThreadService.followThread(payload)
  loadUserThreads()
}

async function updateThread(payload) {
  await ThreadService.updateThread(payload)
  await loadThreads(getActiveChannel.value.id)
  if (getActiveThread.value) {
    setActiveThread(getThread(getActiveThread.value.id))
  }
}

async function deleteThread(id) {
  await ThreadService.deleteThread(id)
  removeThread(id)
}

async function loadUser() {
  const user = await ThreadService.getUser(state.uid)
  if (user.pseudonyms) {
    state.auth = [...user.pseudonyms]
  }
  return user
}

async function updateUser(payload) {
  return await ThreadService.updateUser({
    ...payload,
    userId: state.uid
  })
}

async function loadChannel(id) {
  return await ThreadService.getChannel(id)
}

async function loadUserChannels() {
  if (!getLoggedInStatus.value) await registerOnce()
  const userChannels = await ThreadService.getUserChannels()
  setUserChannels(userChannels)
}

async function loadChannels() {
  if (getLoggedInStatus.value) {
    const channels = await ThreadService.getChannels()
    setChannels(channels)
  } else {
    const channels = await ThreadService.getPublicChannels(getActivePseudonym.value.token)
    setChannels(channels)
  }
}

async function loadUserThreads() {
  if (!getLoggedInStatus.value) await registerOnce()
  const userThreads = await ThreadService.getUserThreads()
  setUserThreads(userThreads)
}

async function loadThreads(channelId) {
  if (!getLoggedInStatus.value) await registerOnce()
  const threads = await ThreadService.getThreads(channelId)
  setThreads(threads)
}

async function loadThread(threadId) {
  return await ThreadService.getThread(threadId)
}

async function loadMessages(threadId) {
  const messages = await ThreadService.getMessages(threadId)
  setMessages(messages)
}

/**
 * Create message using API and update
 * messages array with response
 */
async function postMessage(payload) {
  const message = await ThreadService.createMessage(payload)
  setMessage(message)
}

async function upvote(id, status) {
  await ThreadService.vote({
    messageId: id,
    direction: 'up',
    status
  })
}

/**
 * Let only non guest user downvote a message
 * @param {*} id : message id to cast down vote
 */
async function downvote(id, status) {
  if (!getGuestStatus.value) {
    await ThreadService.vote({
      messageId: id,
      direction: 'down',
      status
    })
  }
}

/**
 * Update messages array with ws response
 */
async function addMessage(message) {
  setMessage(message)
}

const getThread = (id) => {
  const threadId = state.threads.findIndex((x) => x.id === id)
  return threadId > -1 ? state.threads[threadId] : {}
}

const getChannel = (id) => {
  const channelId = state.channels.findIndex((x) => x.id === id)
  return channelId > -1 ? state.channels[channelId] : {}
}

function updateUserToken(tokens) {
  ThreadService.setAuth(tokens.access.token)
  VueCookieNext.setCookie('access_token', tokens.access.token)
  VueCookieNext.setCookie('access_token_expiry', tokens.access.expires)
  VueCookieNext.setCookie('refresh_token', tokens.refresh.token)
  VueCookieNext.setCookie('refresh_token_expiry', tokens.refresh.expires)
}

function updateAuth(pseudonyms) {
  state.auth = [...pseudonyms]
  VueCookieNext.setCookie('pseudonym', getActivePseudonym.value.pseudonym)
  VueCookieNext.setCookie('token', getActivePseudonym.value.token)
  VueCookieNext.setCookie('active', getActivePseudonym.value.active)
  VueCookieNext.removeCookie('is_guest')
  state.isGuest = false
}

async function loadNewPseudonym(username, password) {
  return await ThreadService.getNewPseudonym().then(
    (response) => setAuth({ ...response, active: true }),
    (err) => {
      setMajorError('Cannot load pseudonym. Contact administrator.')
      return { isError: true, ...err }
    }
  )
}

async function updateAuthTokens(data) {
  updateUserToken(data.tokens)
  updateAuth(data.user.pseudonyms)
  VueCookieNext.setCookie('uid', data.user.id)
  state.uid = data.user.id
  state.isLoggedIn = true
}

async function loginUser(username, password) {
  return await ThreadService.loginUser(username, password).then((data) => {
    updateAuthTokens(data)
  })
}

async function forgotPassword(email) {
  return await ThreadService.forgotPassword(email)
}

async function resetPassword(password, token) {
  return await ThreadService.resetPassword({
    password,
    token
  })
}

async function registerUser(username, password, email) {
  let payload = {
    username,
    password,
    pseudonym: getActivePseudonym.value.pseudonym,
    token: getActivePseudonym.value.token
  }
  if (email.trim().length > 0) {
    payload = { ...payload, email }
  }
  return await ThreadService.registerUser(payload).then((data) => {
    updateAuthTokens(data)
  })
}

async function registerOnce() {
  return await ThreadService.registerOnce({
    pseudonym: getActivePseudonym.value.pseudonym,
    token: getActivePseudonym.value.token
  }).then((data) => {
    updateAuthTokens(data)
    VueCookieNext.setCookie('is_guest', 'true')
    state.isGuest = true
  })
}

async function createNewPseudonym() {
  if (getPseudonyms.value.length < 5) {
    return await ThreadService.getNewPseudonym().then((response) =>
      ThreadService.registerNewPseudonym(response).then((data) => updateAuth(data))
    )
  }
}

async function deletePseudonym(id) {
  if (getActivePseudonym.value?._id !== id) {
    await ThreadService.deletePseudonym(id)
  }
}

async function activatePseudonym(token) {
  const isGuest = state.isGuest
  if (token === null) {
    token = VueCookieNext.getCookie('token')
  }
  const pseudonyms = await ThreadService.activatePseudonym({
    token
  })
  updateAuth(pseudonyms)
  if (isGuest) {
    VueCookieNext.setCookie('is_guest', 'true')
    state.isGuest = true
  }
}

async function loadPseudonyms() {
  const isGuest = state.isGuest
  const pseudonyms = await ThreadService.getPseudonyms()
  updateAuth(pseudonyms)
  if (isGuest) {
    VueCookieNext.setCookie('is_guest', 'true')
    state.isGuest = true
  }
}

async function logout() {
  await loadNewPseudonym()
  await registerOnce()
}

// Getters
const getUserThreads = computed(() => state.userThreads)
const getUserChannels = computed(() => state.userChannels)

const getThreads = computed(() => state.threads)

const getUserToken = computed(() => VueCookieNext.getCookie('access_token'))

const getChannels = computed(() => state.channels)
const getMessages = computed(() => state.messages)

const getLoggedInStatus = computed(() => {
  return state.isLoggedIn
})

const getGuestStatus = computed(() => {
  return state.isGuest
})

const getActivePseudonym = computed(() => state.auth.filter((x) => x.active === true).pop())

const getPseudonyms = computed(() => state.auth)

const getMajorError = computed(() => state.majorError)

const getId = computed(() => state.uid)

const getActiveChannel = computed(() => state.activeChannel)
const getActiveThread = computed(() => state.activeThread)

const showChatOnly = computed(() => state.showChatOnly)

/**
 * Threshold Poll services
 */

// Getters
const getPolls = computed(() => state.polls)
const getPollResponses = computed(() => state.pollResponses)
const getActivePoll = computed(() => state.activePoll)
const getPollFromList = (id) => {
  const pollId = state.polls.findIndex((x) => x._id === id)
  return pollId > -1 ? state.polls[pollId] : {}
}

// Mutations
function setPolls(polls) {
  state.polls = [...polls]
}

function addPoll(poll) {
  state.polls = [...state.polls, poll]
}

function setPollResponses(responses) {
  state.pollResponses = [...responses]
}

function setActivePoll(poll) {
  state.activePoll = { ...poll }
}

// Actions

async function createPoll(payload) {
  const newPoll = await PollService.createPoll(payload)
  addPoll(newPoll)
}

async function loadPolls(channelId) {
  if (!getLoggedInStatus.value) await registerOnce()
  const polls = await PollService.getPolls(channelId)
  setPolls(polls)
}

async function inspectPoll(pollId) {
  return await PollService.inspectPoll(pollId)
}

async function respondPoll({ pollId, choiceText }) {
  await PollService.respondPoll(pollId, choiceText)
  // Refresh poll responses
  await inspectPoll(pollId)
}

async function loadPollResponses(pollId) {
  const responses = await PollService.getPollResponses(pollId)
  setPollResponses(responses)
  return responses
}

async function loadPollResponseCounts(pollId) {
  const responses = await PollService.getPollResponseCounts(pollId)
  setPollResponses(responses)
  return responses
}

export default {
  getThread,
  setThread,
  loadThreads,
  loadUserThreads,
  loadThread,
  createThread,
  followThread,
  getUserThreads,
  getThreads,
  updateThread,
  deleteThread,
  setActiveThread,
  getActiveThread,
  upsertThread,

  createPoll,
  addPoll,
  inspectPoll,
  respondPoll,
  loadPolls,
  loadPollResponses,
  loadPollResponseCounts,
  getActivePoll,
  setActivePoll,
  getPolls,
  getPollResponses,
  getPollFromList,

  getChannels,
  getChannel,
  loadChannels,
  loadUserChannels,
  loadChannel,
  setActiveChannel,
  getActiveChannel,
  getUserChannels,
  createChannel,
  followChannel,
  updateChannel,
  deleteChannel,

  logout,
  loginUser,
  registerUser,
  updateUserToken,
  getGuestStatus,
  getLoggedInStatus,
  getUserToken,
  getId,
  loadUser,
  updateUser,

  loadMessages,
  clearMessages,
  postMessage,
  getMessages,
  addMessage,
  updateMessage,
  upvote,
  downvote,

  registerOnce,
  createNewPseudonym,
  loadNewPseudonym,
  deletePseudonym,
  activatePseudonym,

  loadPseudonyms,
  getPseudonyms,
  getActivePseudonym,

  getMajorError,

  forgotPassword,
  resetPassword,

  showChatOnly,
  setShowChatOnly
}
