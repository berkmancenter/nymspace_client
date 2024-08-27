<template>
  <div
    class="h-1 flex-shrink flex-1 flex flex-col rounded-b items-center border-gray-500 w-full overflow-y-auto"
  >
    <div v-if="items.length" class="w-full h-1 flex-shrink flex flex-col">
      <template v-for="item in items" :key="item.id">
        <MessageViewItem :item="item" v-bind="$attrs" :userId="userId" />
      </template>
    </div>
    <div
      v-if="!items.length"
      class="text-gray-500 p-2 flex-1 flex flex-col w-full text-center justify-center"
    >
      Start chatting
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
