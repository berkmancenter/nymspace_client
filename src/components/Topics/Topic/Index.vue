<template>
  <div class="topic-view">
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
  methods: {},
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
