<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="w-1/2 float-left">
      <div class="mr-2">
        <h2 class="text-red-500 text-2xl my-4">{{ channel }}</h2>
        <ThreadList :items="items" />
        <a
          class="w-full text-center block border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-9 hover:bg-gray-100;"
          >Create new thread</a
        >
      </div>
    </div>
    <div class="w-1/2 float-right">
      <div class="ml-2">
        <h2 class="text-red-500 text-2xl my-4">{{ thread }}</h2>
        <ThreadView :items="threadItems" />
        <textarea
          class="w-full block border-2 border-gray-500 text-lg p-2 h-40 mt-4"
          placeholder="Message (hit enter to end)"
        ></textarea>
      </div>
    </div>
    <div class="clear-both"></div>
  </div>
</template>

<script>
import SearchBox from "../components/SearchBox.vue";
import ThreadList from "../components/Threads/ThreadList.vue";
import ThreadView from "../components/Threads/ThreadView.vue";
import { defineComponent } from "@vue/runtime-core";
import ThreadService from "../service";
export default defineComponent({
  components: { SearchBox, ThreadList, ThreadView },

  computed: {
    channel() {
      return this.$route.params.channel;
    },
    thread() {
      return this.$route.params.thread;
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
      threadItems: [
        {
          id: 1,
          username: "Poseidon",
          votes: 1,
          message:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dapibus laoreet maximus.",
        },
        {
          id: 2,
          username: "Luna",
          votes: -2,
          message:
            "Duis volutpat nunc eu lorem tempor pulvinar. Nulla iaculis sem sed nisl ultricies efficitur.",
        },
        {
          id: 3,
          username: "Poseidon",
          votes: 2,
          message:
            "Pellentesque volutpat, lacus eget laoreet imperdiet, nisl eros tincidunt magna, at maximus enim diam a mauris. Aliquam egestas, risus eu euismod condimentum, sem mi tempor mi, id dignissim lectus ex sit amet magna.",
        },
      ],
    };
  },
});
</script>
