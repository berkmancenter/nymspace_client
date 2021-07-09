<template>
  <div class="topic-view">
    <div class="topic-view-topic-header">
      <h5 class="is-size-5 is-flex is-align-items-flex-start">
        <span class="topic-view-topic-header-icon">TOPIC</span>
        <div class="topic-view-topic-header-title word-wrap">
          {{ $store.state.user.currentTopic.name }}
        </div>
      </h5>
    </div>
  </div>
</template>

<script>
import styles from '@/assets/scss/Topics/Topic/index.scss'
import axios from 'axios'

export default {
  name: 'new-topic-index',
  components: {},
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
      axios
        .get(`${process.env.API_SERVER_URL}/v1/topics/${this.$route.params.topic}`)
        .then((response) => {
          this.$store.commit('user/setCurrentTopic', response.data)
        })
    },
  },
  watch: {
    '$route.params.topic': function () {
      this.reloadTopic()
    },
  },
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
