<template>
  <div class="topic-view">
    <ContentHeader
      viewTitle="Topic"
      :contentTitle="$store.state.user.currentTopic.name"
    ></ContentHeader>
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
    this.reloadTopic()
  },
  mounted() {},
  computed: {},
  methods: {
    reloadTopic() {
      if (this.$route.params.topicId) {
        axios
          .get(`${process.env.API_SERVER_URL}/v1/topics/${this.$route.params.topicId}`)
          .then((response) => {
            this.$store.commit('user/setCurrentTopic', response.data)
          })
      }
    },
  },
  watch: {
    '$route.params.topicId': function () {
      this.reloadTopic()
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Topics/Topic/index.scss';
</style>
