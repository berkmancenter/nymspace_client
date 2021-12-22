<template>
  <div
    class="col-span-8 hover:bg-gray-100 px-2 py-1 cursor-pointer"
    @click="tagClick(item)"
  >
    {{ item }}
  </div>
</template>

<script>
import { ChatAltIcon } from "@heroicons/vue/outline";
export default {
  components: {
    ChatAltIcon,
  },

  props: {
    item: {
      type: String,
      required: true,
    },
  },

  methods: {
    tagClick(item) {
      this.$emit("tag-click", item);
    },
  },
};
</script>
