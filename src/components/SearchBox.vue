<template>
  <input
    v-model="searchText"
    class="rounded border-2 border-gray-500 w-full h-12 px-3 text-xl"
    type="text"
    placeholder="Search for a channel by keyword"
    @keyup="emit('update-search', searchText)"
  />
</template>

<script setup>
import { ref } from "vue";

const searchText = ref("");

const emit = defineEmits(["update-search"]);
</script>
