<template>
  <div class="talk-view">
    <SwitMenu button-id="header-hamburger">
      <SideMenu></SideMenu>
    </SwitMenu>
    <SessionAsk></SessionAsk>
  </div>
</template>

<script>
import styles from './../../assets/scss/Talk/index.scss'
import SideMenu from './SideMenu'
import SwitMenu from './../Shared/SwitMenu/Index'
import SessionAsk from './SessionAsk'

export default {
  name: 'talk-index',
  components: {
    SideMenu,
    SwitMenu,
    SessionAsk,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
