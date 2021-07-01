<template>
  <div class="talk-view-side-menu">
    <div class="talk-view-side-menu-toolbox">
      <div class="talk-view-side-menu-header" @click="toggleSection($event)">Toolbox</div>

      <div class="talk-view-side-menu-content">
        <div class="talk-view-side-menu-content-item">Add Topic</div>
        <div class="talk-view-side-menu-content-item">Add Thread</div>
        <div class="talk-view-side-menu-content-item">Settings</div>
      </div>
    </div>

    <div class="talk-view-side-menu-threads">
      <div class="talk-view-side-menu-header" @click="toggleSection($event)">Your Threads</div>

      <div class="talk-view-side-menu-content">
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
    toggleSection(event) {
      $(event.target).next('.talk-view-side-menu-content').slideToggle()
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
