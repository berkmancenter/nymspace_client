<template>
  <div class="flex-1 flex flex-col justify-center">
    <div
      class="w-full text-2xl text-harvard-red flex justify-center items-center text-center font-bold"
    >
      404<br />Oops! Stumbled upon unknown!
    </div>
    <div class="text-center text-xl">
      Either the link does not exist or something went wrong.
    </div>
    <div class="text-center text-xl">
      Go to homepage
      <router-link :to="path" class="text-harvard-red underline"
        >Threads</router-link
      >
    </div>
  </div>
</template>

<script setup>
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : "";
</script>
