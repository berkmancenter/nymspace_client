<template>
  <div class="flex items-center justify-between gap-2 px-2 py-1 font-bold text-gray-500 bg-gray-50 hover:text-gray-900">
    <div class="flex items-center">
      <router-link :to="path" class="text-lg sm:text-2xl">
        <img :src="nymspaceLogo" alt="nymspace" class="h-12" />
      </router-link>
      <a v-if="showVersion" class="ml-4 text-sm" href="https://github.com/berkmancenter/threads_client">{{ version }}</a>
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
import nymspaceLogo from '../../assets/nymspace-logo.png'
const { getMajorError } = store
const showVersion = import.meta.env.VITE_SHOW_VERSION === 'true'
// eslint-disable-next-line
const version = __APP_VERSION__
const path = import.meta.env.VITE_PATH ? `${import.meta.env.VITE_PATH}/` : '/'
</script>
