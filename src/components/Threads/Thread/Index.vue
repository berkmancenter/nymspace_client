<template>
  <div class="thread-view is-flex is-flex-direction-column">
    <ContentHeader
      viewTitle="Thread"
      :contentTitle="$store.state.user.currentThread.name"
      :color="appVariables.threadsColor"
    ></ContentHeader>

    <div class="thread-view-messages is-flex-grow-1" ref="messages">
      <div
        v-if="messages.length > 0"
        class="is-flex is-flex-direction-column is-align-items-flex-start"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="thread-view-messages-item p-3 my-3 mx-4"
        >
          {{ message.body }}
        </div>
      </div>
    </div>

    <div class="thread-view-message-input m-2 is-flex">
      <textarea class="p-2 is-size-6" @keyup.enter="sendMessage" v-model="messageBody"></textarea>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ContentHeader from '@/components/Shared/ContentHeader/Index'
import { nextTick } from 'vue'

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
  created() {
    this.prepareNewThread()
  },
  mounted() {},
  computed: {},
  methods: {
    reloadThread() {
      if (this.$route.params.threadId) {
        axios
          .get(`${process.env.API_SERVER_URL}/v1/threads/${this.$route.params.threadId}`)
          .then((response) => {
            this.$store.commit('user/setCurrentThread', response.data)
          })
      }
    },
    sendMessage(event) {
      if (event.shiftKey === true) {
        return
      }

      event.preventDefault()

      axios.post(`${process.env.API_SERVER_URL}/v1/messages`, {
        body: this.messageBody,
        thread: this.$store.state.user.currentThread.id,
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
    async scrollToLastMessage() {
      await nextTick()
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    },
    prepareNewThread() {
      this.reloadThread()
      this.preloadMessages()
    },
  },
  watch: {
    '$route.params.threadId': function () {
      this.prepareNewThread()
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Threads/Thread/index.scss';
</style>
