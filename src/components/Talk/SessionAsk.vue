<template>
  <div class="talk-session-ask">
    <div class="modal" :class="{ 'is-active': loginScreen }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <div class="is-flex is-justify-content-center">
            <img class="" alt="nymity logo" src="@/assets/images/logo.svg" />
          </div>

          <section class="pt-4 pb-2">
            <h2 class="is-size-2">New user</h2>
            <p>If you want to use this user in the future note/copy the access key.</p>
            <p>You can use it later to use the same identity.</p>
            <p>Click on the code to copy it to your clipboard.</p>
            <p class="is-flex is-align-items-center pt-4">
              <input class="is-size-3" disabled :value="newToken" />
              <button
                id="talk-session-ask-new-login"
                class="button is-success ml-2"
                @click="login($event, true)"
                :class="{
                  'is-loading': logging,
                }"
                :disabled="logging"
              >
                Login
              </button>
            </p>
            <label class="checkbox"> <input type="checkbox" /> Remember me </label>
          </section>

          <hr class="my-4" />

          <section class="pt-0 pb-0">
            <h2 class="is-size-2 pt-0">Returning user</h2>
            <p>Enter your access key</p>
            <p class="is-flex is-align-items-center pt-2">
              <input class="is-size-3" :value="existingToken" />
              <button
                id="talk-session-ask-existing-login"
                class="button is-success ml-2"
                @click="login($event, true)"
                :class="{
                  'is-loading': logging,
                }"
                :disabled="logging"
              >
                Login
              </button>
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import styles from './../../assets/scss/Talk/SessionAsk.scss'
import axios from 'axios'

export default {
  name: 'talk-session-ask-index',
  components: {},
  data() {
    return {
      logging: false,
      newToken: '',
      existingToken: '',
      loginScreen: true,
    }
  },
  created() {
    this.setNewUserToken()
  },
  mounted() {},
  computed: {},
  methods: {
    login(event) {
      this.logging = true

      if (event.target.id === 'talk-session-ask-existing-login') {
        this.loginToken = this.existingToken
      } else {
        this.loginToken = this.newToken
      }

      setTimeout(() => {
        this.$store.dispatch('user/loginUser', this.loginToken)
        axios.post(`${process.env.API_SERVER_URL}/v1/users`, {
          user_token: this.loginToken,
        })
        this.loginScreen = false
        this.logging = false
        this.$store.commit('user/setSideMenuOpen', true)
      }, 1000)
    },
    async setNewUserToken() {
      const res = await axios(`${process.env.API_SERVER_URL}/v1/users/newToken`)
      this.newToken = res.data
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
