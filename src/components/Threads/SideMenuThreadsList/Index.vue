<template>
  <div class="side-menu-threads-list">
    <div v-if="$store.state.user.userThreads.length == 0" class="p-2">
      You don't have any threads yet, search to discover and discuss. Follow or create a thread to
      list it here.
    </div>

    <div v-if="$store.state.user.userThreads.length > 0" class="talk-view-side-menu-threads">
      <div
        v-for="(thread, index) in $store.state.user.userThreads"
        :key="index"
        class="talk-view-side-menu-item talk-view-side-menu-item-sub"
        :class="{ 'talk-view-side-menu-item-sub-active': thread.id == $route.params.threadId }"
        :style="{ borderLeftColor: appVariables.threadsColor }"
      >
        <div class="talk-view-side-menu-item-header talk-view-side-menu-item-sub-header">
          <router-link
            class="
              talk-view-side-menu-item-header-title talk-view-side-menu-item-sub-title
              word-wrap
            "
            :to="{ name: 'thread.index', params: { threadId: thread.id } }"
            >{{ thread.name }}
          </router-link>
          <div class="talk-view-side-menu-item-header-actions">
            <div
              class="
                talk-view-side-menu-item-header-button talk-view-side-menu-item-sub-header-button
              "
              :ref="`header-button${thread.id}`"
              @click="setupAndShowThreadContextMenu(thread.id)"
            >
              <div><i class="fa fa-bars"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'side-menu-threads-list-index',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    setupAndShowThreadContextMenu(threadId) {
      $.contextMenu('destroy')
      let elementRefId = `header-button${threadId}`
      const elem = $(this.$refs[elementRefId])
      elem.contextMenu({
        selector: '> div',
        trigger: 'left',
        hideOnSecondTrigger: true,
        items: {
          newThread: {
            name: 'Delete thread',
            callback: () => this.$store.dispatch('user/deleteThread', threadId),
          },
        },
      })
      elem.find('> div').contextMenu()
    },
  },
}
</script>
