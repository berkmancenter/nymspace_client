<template>
  <div class="thread-view is-flex is-flex-direction-column">
    <ContentHeader
      viewTitle="Thread"
      :contentTitle="$store.state.user.currentThread.name"
      :color="appVariables.threadsColor"
    ></ContentHeader>

    <div class="thread-view-messages m-2 is-flex is-flex-grow-1">
      <div v-if="messages.length > 0">
        <div v-for="(message, index) in messages" :key="index">
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
    this.reloadThread()
    this.preloadMessages()
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
        })
    },
  },
  watch: {
    '$route.params.threadId': function () {
      this.reloadThread()
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Threads/Thread/index.scss';
</style>
