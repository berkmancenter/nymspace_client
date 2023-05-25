<template>
  <div
    class="px-3 pb-1 text-gray-500 font-bold hover:text-gray-900 flex justify-between"
  >
    <div>
      <router-link to="/" class="text-4xl">
        <p class="inline-block text-red-600">nymspace</p>
      </router-link>
      <a
        v-if="showVersion"
        class="text-sm ml-4"
        href="https://github.com/berkmancenter/threads_client/tree/dev"
        >{{ version }}</a
      >
    </div>

    <div v-if="getMajorError?.trim().length > 0">{{ getMajorError }}</div>
    <div class="flex gap-6 items-center">
      <router-link
        v-if="getGuestStatus"
        to="/login"
        class="hover:text-red-600 text-black"
        title="Retain a pseudonym across sessions"
      >Login</router-link>

      <router-link to="/" class="">
        <p class="inline-block hover:text-red-600 text-black">All Channels</p>
      </router-link>
      <a
        class="hover:text-red-600 text-black"
        href="https://cyber.harvard.edu/projects/nymity"
        rel="noopener"
        target="_blank"
        >About Nymity<ExternalLinkIcon class="ml-1 inline-block w-4 h-4" />
      </a>
    </div>
  </div>
</template>
<script setup>
import store from "../../composables/global/useStore";
import { ExternalLinkIcon } from "@heroicons/vue/outline";
import useStore from "../../composables/global/useStore";
const {
  getGuestStatus
} = useStore;
const { getMajorError } = store;
const showVersion = import.meta.env.VITE_SHOW_VERSION === "true";
const version = __APP_VERSION__;
</script>
