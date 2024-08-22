<template>
  <div
    class="py-3 sm:px-10 text-black bg-white border-t hover:text-gray-900 flex flex-col justify-start space-y-4 flex-wrap items-center"
  >
    <a href="https://cyber.harvard.edu/" target="_blank">
      <img :src="berkmanLogo" alt="Berkman Klein Center" class="h-12" />
    </a>
    <div class="flex gap-4 items-center">
      <router-link :to="path" class="">
        <p class="inline-block hover:text-harvard-red text-black">Home</p>
      </router-link>
      <a
        class="hover:text-gray-800 text-black flex items-center gap-1"
        href="https://cyber.harvard.edu/projects/nymity"
        rel="noopener"
        target="_blank"
        >About <ExternalLinkIcon class="w-4 h-4" />
      </a>
      <a
        href="https://github.com/berkmancenter/threads/discussions"
        target="_blank"
        class="hover:text-gray-800 text-black flex items-center gap-1"
      >
        GitHub
        <img :src="githubLogo" alt="nymspace GitHub" class="w-4" />
      </a>
    </div>
  </div>
</template>

<script setup>
import githubLogo from "../../assets/GitHub-Mark-64px.png";
import berkmanLogo from "../../assets/berkman-klein-center-logo.png";
import { ExternalLinkIcon } from "@heroicons/vue/outline";
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : "";
</script>
