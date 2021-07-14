<template>
  <div class="topic-view">
    <ContentHeader
      viewTitle="Topic"
      :contentTitle="$store.state.user.currentTopic.name"
    ></ContentHeader>

    <div class="topic-view-threads p-4">
      <h5 class="is-size-5">Threads</h5>

      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Messages</th>
            <th>Followers</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(thread, index) in $store.state.user.currentTopicThreads" :key="index">
            <td>
              <router-link :to="{ name: 'thread.index', params: { threadId: thread.id } }">
                {{ thread.name }}
              </router-link>
            </td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ContentHeader from '@/components/Shared/ContentHeader/Index'

export default {
  name: 'new-topic-index',
  components: {
    ContentHeader,
  },
  data() {
    return {
      topicName: '',
    }
  },
  created() {
    this.reloadComponent()
  },
  mounted() {},
  computed: {},
  methods: {
    reloadComponent() {
      this.reloadTopic()
      this.reloadTopicThreads()
    },
    reloadTopic() {
      if (this.$route.params.topicId) {
        axios
          .get(`${process.env.API_SERVER_URL}/v1/topics/${this.$route.params.topicId}`)
          .then((response) => {
            this.$store.commit('user/setCurrentTopic', response.data)
          })
      }
    },
    reloadTopicThreads() {
      if (this.$route.params.topicId) {
        axios
          .get(`${process.env.API_SERVER_URL}/v1/threads/topic/${this.$route.params.topicId}`)
          .then((response) => {
            this.$store.commit('user/setCurrentTopicThreads', response.data)
          })
      }
    },
  },
  watch: {
    '$route.params.topicId': function () {
      this.reloadComponent()
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Topics/Topic/index.scss';
</style>
