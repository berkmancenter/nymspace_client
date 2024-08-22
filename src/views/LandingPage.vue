<template>
  <div
    class="sm:mx-auto sm:flex-1 sm:w-11/12 lg:w-3/5 flex flex-col justify-center"
  >
    <Channels :channels="channelsWithFollow" />
  </div>
</template>
<script setup>
import Channels from "../components/Channels/Channels.vue";
import { computed, onMounted, ref } from "vue";
import useStore from "../composables/global/useStore";
const { loadChannels, getChannels, getUserChannels, loadUserChannels } =
  useStore;
const searchText = ref("");

const channelsWithFollow = computed(() => {
  return getChannels.value.map((x) => ({
    ...x,
    isFollowed: getUserChannels.value.some(
      (y) => y.id === x.id && y.hasOwnProperty("followed") && y.followed
    ),
  }));
});

onMounted(async () => {
  await loadUserChannels();
  await loadChannels();
});
</script>
