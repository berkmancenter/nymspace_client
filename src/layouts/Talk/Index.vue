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
      </div>
    </div>

    <SwitMenu button-id="header-hamburger">
      <SideMenu></SideMenu>
    </SwitMenu>

    <section id="content">
      <router-view />
    </section>
  </div>
</template>

<script>
import styles from '@/assets/scss/layouts/Talk.scss'
import SideMenu from './SideMenu'
import SwitMenu from '@/components/Shared/SwitMenu/Index'

export default {
  name: 'default-layout',
  components: {
    SideMenu,
    SwitMenu,
  },
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
