<template>
  <button class="btn" @click="$emit('login')">Use pseudonym for one session</button>

  <router-link :to="`${path}/login`" class="btn" title="Retain a pseudonym across sessions">Login</router-link>
</template>
<script>
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
</script>
<style scoped>
.btn {
  @apply w-full flex justify-center place-items-center bg-white border-2 border-gray-500 text-base px-2 h-16 leading-relaxed hover:bg-gray-100 cursor-pointer md:text-lg md:h-12 md:px-0;
}
</style>
