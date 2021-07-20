<template>
  <div class="login-view container px-4">
    <section class="pt-4 pb-2">
      <h2 class="is-size-2">New user</h2>
      <p>If you want to use this user in the future note/copy the access key.</p>
      <p>You can use it later to use the same identity.</p>
      <p>Click on the clipboard button to copy it to your clipboard.</p>
      <p class="is-flex is-align-items-center pt-4">
        <input type="text" class="is-size-3" readonly :value="newToken" />
        <button
          class="login-view-copy-to-clipboard"
          ref="newTokenCopyToClipboard"
          title="Copy to clipboard"
        >
          <i class="fa fa-clipboard" aria-hidden="true"></i>
        </button>
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
    </section>

    <hr class="my-4" />

    <section class="pt-0 pb-0">
      <h2 class="is-size-2 pt-0">Returning user</h2>
      <p>Enter your access key</p>
      <p class="is-flex is-align-items-center pt-2">
        <input type="text" class="is-size-3" v-model="existingToken" :disabled="logging" />
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
</template>

<script>
import axios from 'axios'
import ClipboardJS from 'clipboard/dist/clipboard'
import { nextTick } from 'vue'

export default {
  name: 'login-index',
  components: {},
  data() {
    return {
      logging: false,
      newToken: '',
      existingToken: '',
      clipboard: false,
    }
  },
  created() {
    this.setNewUserToken()
  },
  mounted() {
    this.setupClipboardCopy()
  },
  computed: {},
  methods: {
    login(event) {
      this.logging = true

      if (event.target.id === 'talk-session-ask-existing-login') {
        this.loginToken = this.existingToken
        this.action = 'login'
      } else {
        this.loginToken = this.newToken
        this.action = 'register'
      }

      this.$store.dispatch(`user/${this.action}`, this.loginToken).then(() => {
        setTimeout(() => {
          this.logging = false

          this.$router.push({ name: 'talk.index' })
        }, 1000)
      })
    },
    async setNewUserToken() {
      const res = await axios(`${process.env.API_SERVER_URL}/v1/users/newToken`)
      this.newToken = res.data
    },
    async setupClipboardCopy() {
      await nextTick()
      this.clipboard = new ClipboardJS(this.$refs.newTokenCopyToClipboard, {
        text: () => this.newToken,
      })
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/Login/Index.scss';
</style>
