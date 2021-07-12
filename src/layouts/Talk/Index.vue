<template>
  <div>
    <div id="header">
      <div class="header-container">
        <div class="header-hamburger" id="header-hamburger" title="Toggle menu"></div>

        <div class="header-logo">
          <a href="/">
            <img alt="nymity logo" src="@/assets/images/logo.svg" />
          </a>
        </div>

        <div class="header-toolbox"></div>
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
  data() {
    return {}
  },
  beforeCreate() {
    document.querySelector('html').classList.add('talk-layout')
  },
  destroy() {
    document.querySelector('html').classList.remove('talk-layout')
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/layouts/Talk.scss';
@import 'font-awesome/css/font-awesome.css';
@import 'jquery-contextmenu/dist/jquery.contextMenu.css';
</style>
