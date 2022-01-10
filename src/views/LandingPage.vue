<template>
  <div class="mx-auto container-width">
    <SearchBox @update-search="updateSearch" class="my-5" />
    <FeaturedChannelList :channels="channels" />
    <div class="flex justify-end my-4">
      <CreateChannel />
    </div>
  </div>
</template>
<script setup>
import SearchBox from "../components/SearchBox.vue";
import FeaturedChannelList from "../components/Channels/FeaturedChannelList.vue";
import CreateChannel from "../components/Channels/CreateChannel.vue";
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

const channels = computed(() => {
  const filteredChannels = channelsWithFollow.value.filter((x) => {
    if (searchText.value.trim().length == 0) {
      return true;
    } else {
      return x.name?.toLowerCase().indexOf(searchText.value) > -1;
    }
  });
  return filteredChannels;
});

onMounted(async () => {
  await loadUserChannels();
  await loadChannels();
});

const updateSearch = (value) => (searchText.value = value?.toLowerCase());
</script>
