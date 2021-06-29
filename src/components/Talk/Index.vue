<template>
  <div class="talk-view">
    <SwitMenu button-id="header-hamburger">
      <SideMenu></SideMenu>
    </SwitMenu>
    No elo
  </div>
</template>

<script>
import styles from './../../assets/scss/Talk/index.scss'
import SideMenu from './SideMenu'
import SwitMenu from './../Shared/SwitMenu/Index'

export default {
  name: 'talk-index',
  components: {
    SideMenu,
    SwitMenu,
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
