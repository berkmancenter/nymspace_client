<template>
  <select class="border-2 border-gray-400 p-1" v-if="getLoggedInStatus()">
    <option disabled selected>Create new channel</option>
    <option value="public">Public</option>
    <option value="private">Private</option>
  </select>
</template>

<script setup>
import useStore from "../../composables/global/useStore";
const { getLoggedInStatus } = useStore;
</script>
