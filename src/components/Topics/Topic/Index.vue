<template>
  <div class="topic-view">
    <ContentHeader
      viewTitle="Topic"
      :contentTitle="$store.state.user.currentTopic.name"
    ></ContentHeader>
  </div>
</template>

<script>
import styles from '@/assets/scss/Topics/Topic/index.scss'
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
