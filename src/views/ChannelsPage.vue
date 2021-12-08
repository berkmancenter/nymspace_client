<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="w-1/2 float-left">
      <div class="mr-2">
        <h2 class="text-red-500 text-2xl my-4">{{ channel }}</h2>
        <ThreadList :items="items" />
        <a
          class="w-full text-center float-left inline-block border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-9 hover:bg-gray-100;"
          >Create new thread</a
        >
      </div>
    </div>
    <div class="w-1/2 float-right">
      <div class="ml-2"></div>
    </div>
    <div class="clear-both"></div>
  </div>
</template>

<script>
import SearchBox from "../components/SearchBox.vue";
import ThreadList from "../components/Threads/ThreadList.vue";
import { defineComponent } from "@vue/runtime-core";
import ThreadService from "../service";
export default defineComponent({
  components: { SearchBox, ThreadList },

  computed: {
    channel() {
      return this.$route.params.channel;
    },
  },

  async created() {
    this.items = await ThreadService.getThreads();
  },

  data() {
    return {
      items: [
        {
          title: "Orientation",
          comment_count: 20,
        },
        {
          title: "Cyber Citizenship",
          comment_count: 21,
        },
      ],
    };
  },
});
</script>
