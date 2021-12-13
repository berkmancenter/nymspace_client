<template>
  <router-link :to="channelLink" :class="getChannelClass(item)">
    <div class="col-span-8 text-lg">{{ item.name }}</div>
    <div class="col-span-2 font-semibold justify-self-end">
      {{ item.threadCount }} threads
    </div>
    <div class="col-span-2 font-semibold justify-self-end">
      {{ item.messageCount }}
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
    getChannelClass(item) {
      var className =
        "grid grid-cols-12 gap-6 p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 cursor-pointer";
      if (item.name == this.$route.params.channelId)
        className += " bg-gray-100";
      return className;
    },
  },
  computed: {
    channelLink() {
      return `/channels/${this.item.id}/`;
    },
    channel() {
      return this.$route.params.channel;
    },
  },
};
</script>
