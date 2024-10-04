<template>
  <input
    v-model="searchText"
    class="rounded border border-gray-500 w-full px-3 py-1"
    type="text"
    placeholder="Filter channels by keyword"
    @keyup="emit('update-search', searchText)"
  />
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')

const emit = defineEmits(['update-search'])
</script>
