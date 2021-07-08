<template>
  <div class="new-topic-view">
    <form @submit="createNewTopic">
      <h1 class="is-size-2">Create new topic</h1>

      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input" type="text" required v-model="topicName" />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-success">Create</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import styles from '@/assets/scss/Topics/NewTopic/index.scss'
import { VueCookieNext } from 'vue-cookie-next'
import axios from 'axios'

export default {
  name: 'new-topic-index',
  components: {},
  data() {
    return {
      topicName: '',
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    createNewTopic(e) {
      e.preventDefault()

      axios
        .post(`${process.env.API_SERVER_URL}/v1/topics`, {
          name: this.topicName,
          owner: VueCookieNext.getCookie('user_token'),
        })
        .then((response) => {
          this.topicName = ''
          this.$store.commit('user/setCurrentTopic', response.data)
          this.$router.push({ name: 'topic.index', params: { topic: response.data.slug } })
          this.$store.dispatch('user/reloadUserTopics')
        })
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
