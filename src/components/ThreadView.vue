<template>
  <div
    class="rounded p-3 items-center border-2 border-gray-500"
    style="min-height: 400px"
  >
    <div class="grid">
      <template v-for="item in items" :key="item.id">
        <ThreadViewItem :item="item" />
      </template>
    </div>
  </div>
</template>

<script>
import ThreadViewItem from "./ThreadViewItem.vue";

export default {
  components: {
    ThreadViewItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
