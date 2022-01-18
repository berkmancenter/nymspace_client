<template>
  <div class="app-footer">
    <a href="https://cyber.harvard.edu/" target="_blank">
      <img :src="berkmanLogo" alt="Berkman Klein Center" class="w-48" />
    </a>
    <a
      href="https://github.com/berkmancenter/threads/discussions"
      target="_blank"
      class="text-xl self-center"
    >
      Threads GitHub
      <img :src="githubLogo" alt="Threads GitHub" class="inline-block w-8" />
    </a>
  </div>
</template>
<style scoped>
.app-footer {
  @apply p-3 text-black font-bold hover:text-gray-900 mt-4 border-t-2 flex justify-between;
}
</style>

<script setup>
import githubLogo from "../../assets/GitHub-Mark-64px.png";
import berkmanLogo from "../../assets/berkman-klein-center-logo.png";
</script>
