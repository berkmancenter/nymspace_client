<template>
  <div
    class="rounded p-3 items-center border-2 border-gray-500 max-h-96 overflow-y-auto"
    style="min-height: 400px"
  >
    <div class="grid">
      <span class="px-2 py-1 text-xl font-bold">All Threads:</span>
      <template v-for="item in items" :key="item.id">
        <ThreadListItem :item="item" />
      </template>
    </div>
  </div>
</template>

<script>
import ThreadListItem from "./ThreadListItem.vue";

export default {
  components: {
    ThreadListItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
