<template>
  <div class="talk-view">
    <SessionAsk v-if="newUser"></SessionAsk>
  </div>
</template>

<script>
import styles from './../../assets/scss/Talk/index.scss'
import SessionAsk from './SessionAsk'
import { VueCookieNext } from 'vue-cookie-next'

export default {
  name: 'talk-index',
  components: {
    SessionAsk,
  },
  data() {
    return {}
  },
  created() {
    this.newUser = !VueCookieNext.getCookie('user_token')
  },
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
