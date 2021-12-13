<template>
  <div class="mx-auto container-width">
    <SearchBox class="my-5" />
    <Suspense>
      <template #default> <FeaturedChannelList /> </template>
      <template #fallback>Loading channels...</template>
    </Suspense>
    <div class="flex justify-end my-4">
      <CreateChannel />
    </div>
  </div>
</template>
<script>
import SearchBox from "../components/SearchBox.vue";
import FeaturedChannelList from "../components/Channels/FeaturedChannelList.vue";
import CreateChannel from "../components/Channels/CreateChannel.vue";
export default {
  components: { SearchBox, FeaturedChannelList, CreateChannel },
};
</script>
