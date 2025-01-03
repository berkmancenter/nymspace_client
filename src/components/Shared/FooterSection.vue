<template>
  <div
    class="flex flex-wrap items-center justify-between px-4 pb-3 space-y-4 text-black bg-white border-t sm:py-3 sm:px-10 hover:text-gray-900 sm:flex-col sm:justify-start"
  >
    <a href="https://cyber.harvard.edu/" target="_blank" class="flex items-center -mb-4 sm:flex-col sm:-mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" alt="Berkman Klein Center logo" class="h-5 mb-1 sm:h-8" viewBox="0 0 450 200">
        <title>Harvard Berkman Klein Center Logo</title>
        <rect x="125.1" width="10" height="171.1" fill="#a51c30"></rect>
        <rect x="286.93" width="10" height="171.1" fill="#a51c30"></rect>
        <polygon
          points="186.8 171.29 179.73 164.22 227.51 116.44 179.59 68.52 186.66 61.45 241.65 116.44 186.8 171.29"
          fill="#a51c30"
        ></polygon>
        <polygon
          points="397.05 171.29 404.12 164.22 356.35 116.44 404.27 68.52 397.19 61.45 342.21 116.44 397.05 171.29"
          fill="#a51c30"
        ></polygon>
        <polygon
          points="0.94 149.47 22.48 171.01 76.75 116.75 21.54 61.55 0 83.09 33.66 116.75 0.94 149.47"
          fill="#a51c30"
        ></polygon>
      </svg>
      <span class="font-bold leading-3">Berkman <span class="hidden sm:inline-block"> Klein Center</span></span>
    </a>
    <div class="flex items-center gap-4">
      <router-link :to="path" class="">
        <p class="inline-block text-black hover:text-harvard-red">Home</p>
      </router-link>
      <a
        class="flex items-center gap-1 text-black hover:text-gray-800"
        href="https://cyber.harvard.edu/projects/nymity-0"
        rel="noopener"
        target="_blank"
        >About <ExternalLinkIcon class="w-4 h-4" />
      </a>
      <a
        href="https://github.com/berkmancenter/threads_client"
        target="_blank"
        class="flex items-center gap-1 text-black hover:text-gray-800"
      >
        GitHub
        <img :src="githubLogo" alt="nymspace GitHub" class="w-4" />
      </a>
    </div>
  </div>
</template>

<script setup>
import githubLogo from '../../assets/GitHub-Mark-64px.png'
import { ExternalLinkIcon } from '@heroicons/vue/outline'
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
</script>
