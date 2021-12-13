<template>
  <div class="p-3 text-4xl text-gray-500 font-bold hover:text-gray-900">
    <router-link to="/">
      <img
        src="/images/threads-logo-v1.svg"
        alt="Threads"
        class="w-12 inline-block"
      />
      <p class="inline-block text-red-600">Threads</p>
    </router-link>
    <div v-if="getMajorError?.trim().length > 0">{{ getMajorError }}</div>
  </div>
</template>
<script setup>
import store from "../../composables/global/useStore";
const { getMajorError } = store;
</script>
