<template>
  <div
    class="rounded p-3 items-center border-2 border-gray-500 max-h-96 overflow-y-auto"
    style="min-height: 400px"
  >
    <div class="grid">
      <span class="text-red-500" v-if="items.length === 0"
        >No messages. Start a conversation.</span
      >
      <template v-for="item in items" :key="item.id">
        <ThreadViewItem :item="item" />
      </template>
    </div>
  </div>
</template>

<script>
import ThreadViewItem from "./ThreadViewItem.vue";

export default {
  components: {
    ThreadViewItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
