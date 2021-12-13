<template>
  <router-link :to="threadLink" :class="getThreadClass(item)">
    <div class="col-span-8 text-lg">{{ item.name }}</div>
    <div class="col-span-2 font-semibold justify-self-end"></div>
    <div class="col-span-2 font-semibold justify-self-end">
      {{ item.comment_count }}
      <ChatAltIcon class="h-5 w-5 inline-block" />
    </div>
  </router-link>
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
    getThreadClass(item) {
      var className =
        "grid grid-cols-12 gap-6 p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 cursor-pointer";
      if (item.id == this.$route.params.threadId) className += "  text-red-500";
      return className;
    },
  },

  computed: {
    threadLink() {
      return `/channels/${this.$route.params.channelId}/threads/${this.item.id}`;
    },
  },
};
</script>
