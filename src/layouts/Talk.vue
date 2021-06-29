<template>
  <div>
    <div id="header">
      <div class="header-container">
        <div class="header-hamburger" id="header-hamburger" title="Toggle menu"></div>

        <div class="header-logo">Nymity</div>
      </div>
    </div>

    <section id="content">
      <router-view />
    </section>
  </div>
</template>

<script>
import styles from './../assets/scss/layouts/Talk.scss'

export default {
  name: 'default-layout',
  components: {},
  data() {
    return {
      build_date: process.env.BUILD_DATE,
      build_version: process.env.BUILD_VERSION,
    }
  },
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
