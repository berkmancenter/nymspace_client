<template>
  <div>
    <div id="header">
      <div class="header-container">
        <div class="header-logo">Nymity</div>
      </div>
    </div>

    <section id="content">
      <transition name="fade">
        <router-view />
      </transition>
    </section>

    <div id="footer">
      <footer class="footer">
        <div class="container">
          <div class="footer-column">
            <div class="container">
              <h5 class="is-size-5">
                We are:
                <ul>
                  <li>
                    open source 🤲
                    <a href="https://github.com/berkmancenter/threads" target="_blank">[github]</a>
                  </li>
                  <li>transparent 🧐</li>
                  <li>non-profit 👍</li>
                  <li>ecotech 🌲</li>
                </ul>
              </h5>
            </div>
          </div>
          <div class="footer-column">
            <div class="container">
              <div class="footer-bkc-logo">
                <img alt="bkc logo" src="@/assets/images/bkc.svg" />
              </div>
            </div>
          </div>
          <div class="footer-column">
            <div class="container">
              <h5 class="is-size-5">2020 @ Berkman Klein Center</h5>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import styles from './../assets/scss/layouts/Pages.scss'

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
