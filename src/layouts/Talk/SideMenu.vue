<template>
  <SwitMenu button-id="header-hamburger">
    <div class="talk-view-side-menu">
      <SideMenuItem :header-background-color="appVariables.topicsColor">
        <template v-slot:header-title>Your Topics</template>
        <template v-slot:header-actions>
          <div
            class="talk-view-side-menu-item-header-button"
            ref="sideMenuTopicsContentMenuButton"
            @click="setupAndShowTopicsContextMenu()"
          >
            <div><i class="fa fa-bars"></i></div>
          </div>
        </template>
        <template v-slot:content>
          <SideMenuTopicsList></SideMenuTopicsList>
        </template>
      </SideMenuItem>

      <SideMenuItem :header-background-color="appVariables.threadsColor">
        <template v-slot:header-title>Your Threads</template>
        <template v-slot:content>
          <SideMenuThreadsList></SideMenuThreadsList>
        </template>
      </SideMenuItem>
    </div>
  </SwitMenu>
</template>

<script>
import styles from '@/assets/scss/layouts/SideMenu.scss'
import SwitMenu from '@/components/SwitMenu/Index'
import SideMenuItem from './SideMenuItem'
import SideMenuTopicsList from '@/components/Topics/SideMenuTopicsList/Index'
import SideMenuThreadsList from '@/components/Threads/SideMenuThreadsList/Index'
import $ from 'jquery'

export default {
  name: 'talk-side-menu-index',
  components: {
    SwitMenu,
    SideMenuItem,
    SideMenuTopicsList,
    SideMenuThreadsList,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.$store.dispatch('user/reloadUserTopics')
    this.$store.dispatch('user/reloadUserThreads')
  },
  computed: {},
  methods: {
    setupAndShowTopicsContextMenu() {
      $.contextMenu('destroy')
      const elem = $(this.$refs.sideMenuTopicsContentMenuButton)
      elem.contextMenu({
        selector: '> div',
        trigger: 'left',
        items: {
          newTopic: {
            name: 'Create new topic',
            callback: () => this.$router.push({ name: 'topics.new.index' }),
          },
        },
      })
      elem.find('> div').contextMenu()
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
