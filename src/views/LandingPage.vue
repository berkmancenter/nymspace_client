<template>
  <div class="mx-auto container-width">
    <SearchBox class="my-5" />
    <FeaturedChannelList />
    <div class="flex justify-end my-4">
      <CreateChannel />
    </div>
  </div>
</template>
<script>
import SearchBox from "../components/SearchBox.vue";
import FeaturedChannelList from "../components/FeaturedChannelList.vue";
import CreateChannel from "../components/CreateChannel.vue";
export default {
  components: { SearchBox, FeaturedChannelList, CreateChannel },
};
</script>
