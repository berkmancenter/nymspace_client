<template>
  <div class="flex items-center justify-between gap-2 px-2 py-1 font-bold text-gray-500 bg-gray-50 hover:text-gray-900">
    <div class="flex items-center">
      <router-link :to="path" class="text-lg sm:text-2xl">
        <p class="inline-block text-harvard-red">nymspace</p>
      </router-link>
      <a v-if="showVersion" class="ml-4 text-sm" href="https://github.com/berkmancenter/threads_client/tree/dev">{{
        version
      }}</a>
    </div>

    <div v-if="getMajorError?.trim().length > 0">{{ getMajorError }}</div>
    <div class="flex flex-col items-center flex-1 gap-6">
      <BannerSection />
    </div>
  </div>
</template>
<script setup>
import BannerSection from '../../components/Banner/BannerSection.vue'
import store from '../../composables/global/useStore'
import useStore from '../../composables/global/useStore'
const { getGuestStatus } = useStore
const { getMajorError } = store
const showVersion = import.meta.env.VITE_SHOW_VERSION === 'true'
const version = __APP_VERSION__
const path = import.meta.env.VITE_PATH ? `${import.meta.env.VITE_PATH}/` : '/'
</script>
