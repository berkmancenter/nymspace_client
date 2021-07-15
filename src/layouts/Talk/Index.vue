<template>
  <div>
    <div id="header">
      <div class="header-container">
        <div class="header-hamburger" id="header-hamburger" title="Toggle menu"></div>

        <div class="header-logo">
          <router-link :to="{ name: 'talk.index' }">
            <img alt="threads logo" src="@/assets/images/logo.svg" />
          </router-link>
        </div>

        <div class="header-toolbox">
          <div class="header-toolbox-item" @click="logout()" title="Logout">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>

    <section id="content">
      <router-view />
    </section>
  </div>
</template>

<script>
import 'jquery-contextmenu/dist/jquery.contextMenu'
import 'jquery-contextmenu/dist/jquery.ui.position'

export default {
  name: 'talk-layout',
  components: {},
  created() {
    this.preparePingRequest()
  },
  data() {
    return {}
  },
  methods: {
    preparePingRequest() {
      this.$store.dispatch('user/setPingRequest')
    },
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push({ name: 'login.index' })
    },
  },
  beforeCreate() {
    document.querySelector('html').classList.add('talk-layout')
  },
  unmounted() {
    document.querySelector('html').classList.remove('talk-layout')
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/layouts/Talk.scss';
@import 'font-awesome/css/font-awesome.css';
@import 'jquery-contextmenu/dist/jquery.contextMenu.css';
</style>
