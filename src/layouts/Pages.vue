<template>
  <div>
    <div id="header">
      <div class="header-container">
        <div class="header-logo">
          <a href="/">
            <img alt="threads logo" src="@/assets/images/logo.svg" />
          </a>
        </div>
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
                <ul class="footer-about-list">
                  <li>
                    open source 🤲
                    <a href="https://github.com/berkmancenter/threads" target="_blank"
                      ><img alt="threads logo" src="@/assets/images/github.png"
                    /></a>
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
                <a href="https://cyber.harvard.edu" target="_blank"
                  ><img alt="bkc logo" src="@/assets/images/bkc.svg"
                /></a>
              </div>
            </div>
          </div>
          <div class="footer-column has-text-centered">
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
export default {
  name: 'pages-layout',
  components: {},
  data() {
    return {}
  },
  beforeCreate() {
    document.querySelector('html').classList.add('pages-layout')
  },
  destroy() {
    document.querySelector('html').classList.remove('pages-layout')
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/layouts/Pages.scss';
</style>
