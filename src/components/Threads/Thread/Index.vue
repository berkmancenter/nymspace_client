<template>
  <div class="thread-view is-flex is-flex-direction-column">
    <ContentHeader
      viewTitle="Thread"
      :contentTitle="$store.state.user.currentThread.name"
      :color="appVariables.threadsColor"
    >
      <template v-slot:actions>
        <div
          class="content-header-actions-icon"
          title="Follow thread"
          v-if="!$store.state.user.currentThread.followed"
          @click="toggleFollow(true)"
        >
          <i class="fa fa-heart-o" aria-hidden="true"></i>
        </div>
        <div
          class="content-header-actions-icon"
          title="Unfollow thread"
          v-if="$store.state.user.currentThread.followed"
          @click="toggleFollow(false)"
        >
          <i class="fa fa-heart" aria-hidden="true"></i>
        </div>
      </template>
    </ContentHeader>

    <div class="thread-view-messages is-flex-grow-1" ref="messages">
      <div
        v-if="messages.length > 0"
        class="
          thread-view-messages-container
          is-flex is-flex-direction-column is-align-items-flex-start
        "
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="thread-view-messages-item p-3 my-3 mx-4 is-flex is-flex-direction-column"
        >
          <div class="thread-view-messages-item-meta is-flex is-align-items-center">
            <div class="thread-view-messages-item-meta-author has-text-weight-bold is-size-7 p-1">
              {{ message.owner }}
            </div>
            <div
              class="
                thread-view-messages-item-meta-created
                has-text-weight-bold has-text-grey-light
                is-size-7
                ml-2
              "
            >
              {{ message.createdAt }}
            </div>
          </div>
          <div class="thread-view-messages-item-body mt-2 p-1 word-wrap">{{ message.body }}</div>
        </div>
      </div>
    </div>

    <div class="thread-view-message-input m-2 is-flex">
      <textarea
        class="p-2 is-size-6"
        @keyup.enter="sendMessage"
        v-model="messageBody"
        ref="messageBox"
      ></textarea>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ContentHeader from '@/components/Shared/ContentHeader/Index'
import { nextTick } from 'vue'
import { io } from 'socket.io-client'
import { VueCookieNext } from 'vue-cookie-next'

export default {
  name: 'thread-index',
  components: {
    ContentHeader,
  },
  data() {
    return {
      threadName: '',
      messageBody: '',
      messages: [],
    }
  },
  created() {},
  mounted() {
    this.prepareNewThread()
    this.$refs.messageBox.focus()
  },
  computed: {},
  methods: {
    reloadThread() {
      if (this.$route.params.threadId) {
        axios
          .get(`${process.env.API_SERVER_URL}/v1/threads/${this.$route.params.threadId}`)
          .then((response) => {
            this.$store.commit('user/setCurrentThread', response.data)
            this.connectToSocket()
            this.handleNewMessages()
          })
      }
    },
    sendMessage(event) {
      if (event.shiftKey === true) {
        return
      }

      event.preventDefault()

      this.socket.emit('message:create', {
        message: {
          body: this.messageBody,
          thread: this.$store.state.user.currentThread._id,
        },
        token: VueCookieNext.getCookie('user_access_token'),
      })

      this.messageBody = ''
    },
    preloadMessages() {
      axios
        .get(`${process.env.API_SERVER_URL}/v1/messages/${this.$route.params.threadId}`)
        .then((response) => {
          this.messages = response.data
          this.scrollToLastMessage()
        })
    },
    connectToSocket() {
      this.disconnectSocket()

      this.socket = io(process.env.WEBSOCKET_SERVER_URL)

      this.socket.on('connect', () => {
        this.socket.emit('thread:join', {
          threadId: this.$route.params.threadId,
          token: VueCookieNext.getCookie('user_access_token'),
        })
      })
    },
    async scrollToLastMessage() {
      await nextTick()
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    },
    handleNewMessages() {
      this.socket.on('message:new', (payload) => {
        this.messages.push(payload)
        this.scrollToLastMessage()
      })
    },
    prepareNewThread() {
      this.reloadThread()
      this.preloadMessages()
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
      }
    },
    toggleFollow(value) {
      this.$store.dispatch('user/setCurrentThreadFollowed', {
        status: value,
        threadId: this.$store.state.user.currentThread._id,
      })
    },
  },
  watch: {
    '$route.params.threadId': function (next) {
      if (next) {
        this.prepareNewThread()
      } else {
        this.disconnectSocket()
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Threads/Thread/index.scss';
</style>
