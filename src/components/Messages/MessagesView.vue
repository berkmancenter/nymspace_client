<template>
  <div
    class="rounded items-center border-2 border-gray-500 h-96 max-h-96 overflow-y-auto"
  >
    <div class="grid">
      <span class="text-red-500 text-center" v-if="items.length === 0"
        >No messages. Start a conversation.</span
      >
      <span class="text-red-500 text-center py-2" v-if="items.length > 0"
        >This is the beginning of the thread.</span
      >
      <template v-for="item in items" :key="item.id">
        <MessageViewItem :item="item" v-bind="$attrs" :userId="userId" />
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
  userId: {
    type: String,
    required: true,
  },
});
</script>
