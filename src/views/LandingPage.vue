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
const { loadChannels, getChannels } = useStore;

const searchText = ref("");
const channels = computed(() => {
  const filteredChannels = getChannels.value.filter((x) => {
    if (searchText.value.trim().length == 0) {
      return true;
    } else {
      return x.name?.toLowerCase().indexOf(searchText.value) > -1;
    }
  });
  return filteredChannels;
});

onMounted(async () => await loadChannels());

const updateSearch = (value) => (searchText.value = value?.toLowerCase());
</script>
