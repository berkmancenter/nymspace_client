<template>
  <div class="talk-view">
    <ContentHeader viewTitle="Trending topics"></ContentHeader>

    <div class="p-4">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Messages</th>
            <th>Followers</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in trendingTopics" :key="index">
            <td>
              <router-link :to="{ name: 'topic.index', params: { topicId: item.id } }">
                {{ item.name }}
              </router-link>
            </td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ContentHeader viewTitle="Trending threads" :color="appVariables.threadsColor"></ContentHeader>

    <div class="p-4">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Messages</th>
            <th>Followers</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in trendingThreads" :key="index">
            <td>
              <router-link :to="{ name: 'thread.index', params: { threadId: item.id } }">
                {{ item.name }}
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
import ContentHeader from '@/components/Shared/ContentHeader/Index'
import axios from 'axios'

export default {
  name: 'talk-index',
  components: {
    ContentHeader,
  },
  data() {
    return {
      trendingTopics: [],
      trendingThreads: [],
    }
  },
  created() {},
  mounted() {
    this.reloadTrending()
  },
  computed: {},
  methods: {
    async reloadTrending() {
      const resTopics = await axios.get(`${process.env.API_SERVER_URL}/v1/topics`)
      this.trendingTopics = resTopics.data

      const resThreads = await axios.get(`${process.env.API_SERVER_URL}/v1/threads`)
      this.trendingThreads = resThreads.data
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Talk/index.scss';
</style>
