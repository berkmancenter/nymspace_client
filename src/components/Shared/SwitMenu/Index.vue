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

export default {
  name: 'switmenu-index',
  props: ['buttonId', 'menuId', 'side'],
  data() {
    return {
      button: false,
      open: false,
      moveFrom: 'left',
    }
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
      if (that.open === true) {
        $('.talk-view').css('padding-left', $('.switmenu-menu').outerWidth() + 'px')
      }
    })
  },
  methods: {
    toggleMenu() {
      this.$store.commit('user/setSideMenuOpen', !this.$store.state.user.sideMenuOpen)

      if (this.open === true) {
        $('.talk-view').css('padding-left', $('.switmenu-menu').outerWidth() + 'px')
      } else {
        $('.talk-view').css('padding-left', 0)
      }
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
