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
        <MessageViewItem :item="item" v-bind="$attrs" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import MessageViewItem from "./MessageViewItem.vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>
