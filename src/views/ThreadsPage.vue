<template>
  <h2 class="text-red-500 text-2xl my-4">{{ threadId }}</h2>
  <ThreadView :items="threadItems" />
  <textarea
    v-model="message"
    @keydown.enter.prevent="sendMessage"
    class="w-full block border-2 border-gray-500 text-lg p-2 h-40 mt-4"
    placeholder="Message (hit enter to end)"
  ></textarea>
</template>

<script>
import SearchBox from "../components/SearchBox.vue";
import ThreadList from "../components/Threads/ThreadList.vue";
import ThreadView from "../components/Threads/ThreadView.vue";
import { defineComponent } from "@vue/runtime-core";
import ThreadService from "../service";
import CreateThread from "../components/Threads/CreateThread.vue";
export default defineComponent({
  components: { SearchBox, ThreadList, ThreadView, CreateThread },

  computed: {
    channel() {
      return this.$route.params.channelId;
    },
    threadId() {
      return this.$route.params.threadId;
    },
  },

  async created() {
    this.threadItems = await ThreadService.getMessages(this.threadId);
  },

  data() {
    return {
      threadItems: [],
      message: "",
    };
  },

  methods: {
    sendMessage: function () {
      if (this.message.trim().length > 0) {
        const msg = {
          body: this.message,
          thread: this.threadId,
        };
        ThreadService.createMessage(msg);
      }
    },
  },
});
</script>
