<template>
  <div
    class="px-2 py-1 text-gray-500 font-bold hover:text-gray-900 flex justify-between gap-2 items-center"
  >
    <div>
      <router-link to="/" class="text-lg sm:text-2xl">
        <p class="inline-block text-harvard-red">nymspace</p>
      </router-link>
      <a
        v-if="showVersion"
        class="text-sm ml-4"
        href="https://github.com/berkmancenter/threads_client/tree/dev"
        >{{ version }}</a
      >
    </div>

    <div v-if="getMajorError?.trim().length > 0">{{ getMajorError }}</div>
    <div class="flex flex-col flex-1 gap-6 items-center">
      <BannerSection />
    </div>
  </div>
</template>
<script setup>
import BannerSection from "../../components/Banner/BannerSection.vue";
import store from "../../composables/global/useStore";
import useStore from "../../composables/global/useStore";
const { getGuestStatus } = useStore;
const { getMajorError } = store;
const showVersion = import.meta.env.VITE_SHOW_VERSION === "true";
const version = __APP_VERSION__;
</script>
