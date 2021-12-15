<template>
  <p class="my-1" :class="getMessageClass(item)" :title="item.createdAt">
    <b>{{ item.pseudonym || item.owner }}</b
    >: {{ item.body }}
  </p>
</template>

<script>
import { ChatAltIcon } from "@heroicons/vue/outline";

export default {
  components: {
    ChatAltIcon,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getMessageClass(item) {
      return item.votes < -1 ? "text-gray-400" : "text-black";
    },
  },

  computed: {
    threadLink() {
      return "/threads/" + this.$route.params.channel + "/" + this.item.name;
    },
  },
};
</script>
