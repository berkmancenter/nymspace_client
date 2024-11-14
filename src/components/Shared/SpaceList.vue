<template>
  <div class="items-center sm:h-96 max-h-96">
    <template v-for="item in items" :key="item.id">
      <ThreadListItem v-if="item.type === 'thread'" :item="item" :toggle-threads-menu="props.toggleThreadsMenu" />
      <PollListItem v-else-if="item.type === 'poll'" :item="item" :toggle-threads-menu="props.toggleThreadsMenu" />
    </template>
  </div>
</template>

<script setup>
import ThreadListItem from '../Threads/ThreadListItem.vue'
import PollListItem from '../Polls/PollListItem.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  toggleThreadsMenu: {
    type: Function,
    required: false,
    default: () => {}
  }
})
</script>
