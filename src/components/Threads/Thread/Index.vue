<template>
  <div class="thread-view">
    <ContentHeader
      viewTitle="Thread"
      :contentTitle="$store.state.user.currentThread.name"
    ></ContentHeader>
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
    }
  },
  created() {
    this.reloadThread()
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
