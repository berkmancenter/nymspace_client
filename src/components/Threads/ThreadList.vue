<template>
  <div class="items-center sm:h-96 max-h-96">
    <template v-for="item in items" :key="item.id">
      <ThreadListItem :item="item" :toggle-threads-menu="props.toggleThreadsMenu" />
    </template>
  </div>
</template>

<script setup>
import ThreadListItem from './ThreadListItem.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  toggleThreadsMenu: {
    type: Function,
    required: false
  }
})
</script>
