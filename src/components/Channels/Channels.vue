<template>
  <div
    class="rounded p-3 items-center border-2 border-gray-500 max-h-96 overflow-y-auto"
    style="min-height: 400px"
  >
    <div class="grid grid-cols-2 items-center justify-center mt-1 mb-5">
      <div class="text-3xl font-bold text-red-600">Channels</div>
      <div class="justify-self-end">
        <select v-model="sortBy" class="text-lg border-2 border-gray-500">
          <option disabled>Sort By:</option>
          <template v-for="sortByItem in sortByItems">
            <option :value="sortByItem.value">{{ sortByItem.name }}</option>
          </template>
        </select>
      </div>
    </div>
    <ChannelList v-show="finalItems.length > 0" :items="finalItems" />
    <div class="text-red-600" v-show="finalItems.length === 0">
      No channels available
    </div>
  </div>
</template>

<script setup>
import ChannelList from "./ChannelList.vue";
import { computed, ref } from "vue";

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
];

const props = defineProps({
  channels: {
    type: Array,
    required: true,
  },
});

const sortBy = ref("defaultSortAverage");
const order = ref("desc");

const finalItems = computed(() => [
  ...props.channels.filter((x) => x.isFollowed),
  ...sortedItems.value,
]);

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
</script>
