<template>
  <div class="my-6 bg-white p-2 sm:p-4 shadow-sm sm:rounded-lg sm:shadow">
    <div class="flex items-center justify-between">
      <h2 class="font-bold text-xl">Channels</h2>

      <label for="sort" class="sr-only">Sort by</label>
      <select
        v-model="sortBy"
        id="sort"
        name="sort"
        class="mt-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option disabled>Sort By:</option>
        <template v-for="sortByItem in sortByItems">
          <option :value="sortByItem.value">{{ sortByItem.name }}</option>
        </template>
      </select>
    </div>

    <SearchBox @update-search="updateSearch" class="my-2" />

    <ul>
      <ChannelList v-show="finalItems.length > 0" :items="finalItems" />
      <li v-show="finalItems.length === 0" class="text-xl text-center my-10">
        No channels available
      </li>
    </ul>

    <div class="flex justify-end my-4">
      <CreateChannel />
    </div>
  </div>
</template>

<script setup>
import ChannelList from "./ChannelList.vue";
import CreateChannel from "../Channels/CreateChannel.vue";
import { computed, ref } from "vue";
import SearchBox from "../SearchBox.vue";

const props = defineProps({
  channels: {
    type: Array,
    required: true,
  },
});

const searchText = ref("");

const sortByItems = [
  {
    name: "Recent",
    value: "latestMessageCreatedAt",
  },
  {
    name: "Activity",
    value: "messageCount",
  },
  {
    name: "Default",
    value: "defaultSortAverage",
  },
];

const sortBy = ref("latestMessageCreatedAt");
const order = ref("desc");

const sortedItems = computed(() => [
  ...props.channels
    .filter((x) => !x.isFollowed)
    .sort((a, b) => {
      const multiplier = order === "asc" ? 1 : -1;

      if (a[sortBy.value] == b[sortBy.value]) {
        return 0;
      } else if (a[sortBy.value] > b[sortBy.value]) {
        return 1 * multiplier;
      } else if (a[sortBy.value] < b[sortBy.value]) {
        return -1 * multiplier;
      }
    }),
]);

const finalItems = computed(() =>
  [...props.channels.filter((x) => x.isFollowed), ...sortedItems.value].filter(
    (x) => {
      if (searchText.value.trim().length == 0) {
        return true;
      } else {
        return x.name?.toLowerCase().indexOf(searchText.value) > -1;
      }
    }
  )
);

const updateSearch = (value) => (searchText.value = value?.toLowerCase());
</script>
