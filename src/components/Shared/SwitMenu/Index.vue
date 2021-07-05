<template>
  <div
    class="switmenu-menu"
    :class="{
      'switmenu-menu-active': $store.state.user.sideMenuOpen,
      'switmenu-menu-from-left': moveFrom === 'left',
      'switmenu-menu-from-right': moveFrom === 'right',
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
import $ from 'jquery'
import styles from './../../../assets/scss/Shared/SwitMenu/index.scss'
import { VueCookieNext } from 'vue-cookie-next'

export default {
  name: 'switmenu-index',
  props: ['buttonId', 'menuId', 'side'],
  data() {
    return {
      button: false,
      moveFrom: 'left',
    }
  },
  created() {
    this.$store.commit(
      'user/setSideMenuOpen',
      VueCookieNext.getCookie('user_side_menu_status') === 'true'
    )
  },
  mounted() {
    if (this.side) {
      this.moveFrom = this.side
    }

    this.button = $('#' + this.buttonId).first()
    if (!this.button) {
      return
    }

    this.button.on('click', this.toggleMenu)
    $('.switmenu-menu a').on('click', this.closeMenu)

    let that = this
    $(window).resize(function () {
      if (that.$store.state.user.sideMenuOpen === true) {
        that.updateMenuOpen()
      }
    })

    this.updateMenuOpen()
  },
  methods: {
    toggleMenu() {
      const newStatus = !this.$store.state.user.sideMenuOpen
      this.$store.commit('user/setSideMenuOpen', newStatus)
      VueCookieNext.setCookie('user_side_menu_status', newStatus)

      if (newStatus === true) {
        this.updateMenuOpen()
      } else {
        $('#content').css('padding-left', 0)
      }
    },
    updateMenuOpen() {
      $('#content').css('padding-left', $('.switmenu-menu').outerWidth() + 'px')
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
