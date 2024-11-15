<template>
  <div class="items-center sm:h-96 max-h-96">
    <template v-for="item in items" :key="item.id">
      <ThreadListItem v-if="item.type === 'thread'" :item="item" :toggle-side-menu="props.toggleSideMenu" />
      <PollListItem v-else-if="item.type === 'poll'" :item="item" :toggle-side-menu="props.toggleSideMenu" />
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
  toggleSideMenu: {
    type: Function,
    required: true
  }
})
</script>
