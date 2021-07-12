<template>
  <div class="side-menu-topics-list">
    <div v-if="$store.state.user.userTopics.length == 0" class="p-2">
      You don't have any topics yet, search to discover and discuss. Follow or create a topic to
      list it here.
    </div>

    <div v-if="$store.state.user.userTopics.length > 0" class="talk-view-side-menu-topics">
      <div
        v-for="(topic, index) in $store.state.user.userTopics"
        :key="index"
        class="talk-view-side-menu-item talk-view-side-menu-item-sub"
      >
        <div class="talk-view-side-menu-item-header talk-view-side-menu-item-sub-header">
          <router-link
            class="
              talk-view-side-menu-item-header-title talk-view-side-menu-item-sub-title
              word-wrap
            "
            :to="'/t/' + topic.id"
            >{{ topic.name }}
          </router-link>
          <div class="talk-view-side-menu-item-header-actions">
            <div
              class="
                talk-view-side-menu-item-header-button talk-view-side-menu-item-sub-header-button
              "
              :ref="`header-button${topic.id}`"
              @click="setupAndShowTopicContextMenu(topic.id)"
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
  name: 'side-menu-topics-list-index',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    setupAndShowTopicContextMenu(topicId) {
      $.contextMenu('destroy')
      let elementRefId = `header-button${topicId}`
      const elem = $(this.$refs[elementRefId])
      elem.contextMenu({
        selector: '> div',
        trigger: 'left',
        items: {
          newThread: {
            name: 'Create new thread',
            callback: () =>
              this.$router.push({ name: 'threads.new.index', params: { topicId: topicId } }),
          },
        },
      })
      elem.find('> div').contextMenu()
    },
  },
}
</script>
