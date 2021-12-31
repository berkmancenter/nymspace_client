<template>
  <div
    class="px-2 py-1 cursor-pointer hover:bg-gray-100"
    @click="tagClick(item)"
  >
    <slot>
      {{ item }}
    </slot>
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
