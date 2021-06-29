<template>
  <div class="talk-view-side-menu">
    <div class="talk-view-side-menu-toolbox">
      <div class="talk-view-side-menu-toolbox-header" @click="toggleToolbox()">Toolbox</div>

      <div class="talk-view-side-menu-toolbox-content">
        <div class="talk-view-side-menu-toolbox-item">Add Topic</div>
        <div class="talk-view-side-menu-toolbox-item">Add Thread</div>
        <div class="talk-view-side-menu-toolbox-item">Settings</div>
      </div>
    </div>

    <div class="talk-view-side-menu-threads">
      <div class="talk-view-side-menu-threads-header" @click="toggleThreads()">Your Threads</div>

      <div class="talk-view-side-menu-threads-content">
        You don't have any yet, search to discover and discuss. Follow a thread to list it here.
      </div>
    </div>
  </div>
</template>

<script>
import styles from './../../assets/scss/Talk/SideMenu.scss'
import $ from 'jquery'

export default {
  name: 'talk-side-menu-index',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    toggleToolbox() {
      $('.talk-view-side-menu-toolbox-content').slideToggle()
    },
    toggleThreads() {
      $('.talk-view-side-menu-threads-content').slideToggle()
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
