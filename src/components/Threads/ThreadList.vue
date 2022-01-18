<template>
  <div
    class="rounded items-center border-2 border-gray-500 max-h-screen overflow-y-auto"
    style="min-height: 400px"
  >
    <div class="grid">
      <span class="px-2 py-1 text-lg font-bold">All Threads:</span>
      <template v-for="item in items" :key="item.id">
        <ThreadListItem :item="item" />
      </template>
    </div>
  </div>
</template>

<script setup>
import ThreadListItem from "./ThreadListItem.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>
