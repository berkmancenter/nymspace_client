<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="lg:w-1/2 lg:inline-block p-3 text-lg">
      <button class="btn" @click="$emit('login')">
        Use this pseudonym for one session
      </button>
    </div>
    <div class="lg:w-1/2 lg:inline-block p-3 text-lg">
      <button class="btn">
        <router-link to="/login">
          Login
          <span class="text-gray-600 text-sm"
            >retain a pseudonym across sessions</span
          >
        </router-link>
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["login"]);
</script>

<style scoped>
.btn {
  @apply w-full md:w-auto  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
