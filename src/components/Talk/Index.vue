<template>
  <div class="talk-view">
    <SessionAsk v-if="newUser"></SessionAsk>
  </div>
</template>

<script>
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
    this.newUser = !VueCookieNext.getCookie('user_access_token')
  },
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
@import '@/assets/scss/Talk/index.scss';
</style>
