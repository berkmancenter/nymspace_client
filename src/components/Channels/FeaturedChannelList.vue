<template>
  <div
    class="rounded p-3 items-center border-2 border-gray-500 max-h-96 overflow-y-auto"
    style="min-height: 400px"
  >
    <div class="grid grid-cols-2 items-center justify-center mt-1 mb-5">
      <div class="text-3xl font-bold text-red-600">Featured Channels</div>
      <div class="justify-self-end">
        <select v-model="sortBy" class="text-lg border-2 border-gray-500">
          <option disabled>Sort By:</option>
          <template v-for="sortByItem in sortByItems">
            <option :value="sortByItem.value">{{ sortByItem.name }}</option>
          </template>
        </select>
      </div>
    </div>
    <ChannelList v-show="sortedItems.length > 0" :items="sortedItems" />
    <div class="text-red-600" v-show="sortedItems.length === 0">
      No channles available
    </div>
  </div>
</template>

<script setup>
import ChannelList from "./ChannelList.vue";
import useChannels from "../../composables/useChannels";
import userSorting from "../../composables/userSorting";

const sortByItems = [
  {
    name: "Default",
    value: "defaultSortAverage",
  },
  {
    name: "Recent",
    value: "latestMessageCreatedAt",
  },
  {
    name: "Activity",
    value: "messageCount",
  },
  {
    name: "Starred",
    value: "follows",
  },
];
const { channels } = await useChannels();
const { sortedItems, sortBy } = userSorting(channels);
</script>
