<template>
  <div class="talk-view-side-menu">
    <SideMenuItem>
      <template v-slot:header-title> Your Topics </template>
      <template v-slot:header-actions>
        <div class="talk-view-side-menu-item-header-button" ref="sideMenuTopicsContentMenuButton">
          <div><i class="fa fa-bars"></i></div>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="$store.state.user.userTopics.length == 0">
          You don't have any topics yet, search to discover and discuss. Follow or create a topic to list it here.
        </div>

        <div v-if="$store.state.user.userTopics.length > 0" class="talk-view-side-menu-topics">
          <div
            v-for="(topic, index) in $store.state.user.userTopics"
            :key="index"
            class="talk-view-side-menu-topics-item"
          >
            <div class="talk-view-side-menu-item-header-title">
              {{ topic.name }}
            </div>
            <div class="talk-view-side-menu-item-header-actions">
              <div class="talk-view-side-menu-item-header-button">
                <div><i class="fa fa-bars"></i></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </SideMenuItem>

    <SideMenuItem>
      <template v-slot:header-title>Your Threads</template>
      <template v-slot:content>
        You don't have any threads yet, search to discover and discuss. Follow or create a thread to list it here.
      </template>
    </SideMenuItem>
  </div>
</template>

<script>
import styles from '@/assets/scss/layouts/SideMenu.scss'
import SideMenuItem from './SideMenuItem'
import $ from 'jquery'

export default {
  name: 'talk-side-menu-index',
  components: {
    SideMenuItem,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.setupTopicsContextMenu()
    this.$store.dispatch('user/reloadUserTopics')
  },
  computed: {},
  methods: {
    setupTopicsContextMenu() {
      $(this.$refs.sideMenuTopicsContentMenuButton).contextMenu({
        selector: '> div',
        trigger: 'left',
        items: {
          foo: {
            name: 'Create new topic',
            callback: () => this.$router.push({ name: 'topics.new.index' }),
          },
        },
      })
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
