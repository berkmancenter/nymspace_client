<template>
  <div class="flex flex-col items-center flex-1 flex-shrink w-full h-1 overflow-y-auto border-gray-500 rounded-b">
    <div v-if="items.length" class="flex flex-col flex-shrink w-full h-1">
      <template v-for="item in items" :key="item.id">
        <MessageViewItem :item="item" v-bind="$attrs" :user-id="userId" />
      </template>
    </div>
    <div v-if="!items.length" class="flex flex-col justify-center flex-1 w-full p-2 text-center text-gray-500">
      Start chatting
    </div>
  </div>
</template>

<script setup>
import MessageViewItem from './MessageViewItem.vue'

defineProps({
  items: {
    type: Array,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})
</script>
