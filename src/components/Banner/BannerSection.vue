<template>
  <div class="bg-gray-200 p-4">
    <div class="text-center text-2xl p-4">
      Hello, [<select class="bg-gray-200 text-red-500">
        <option class="text-red-500">
          {{ getPseudonym?.pseudonym }}
        </option>
      </select>
      ]. Would you like to:
    </div>
    <component
      :is="
        getLoggedInStatus()
          ? defineAsyncComponent(() => import('./LoggedInBanner.vue'))
          : defineAsyncComponent(() => import('./GuestBanner.vue'))
      "
      :user-token="getUserToken"
    ></component>
  </div>
</template>

<script setup>
import useStore from "../../composables/global/useStore";
import { computed } from "@vue/reactivity";
import { defineAsyncComponent } from "@vue/runtime-core";

const { getLoggedInStatus, getUserToken, getPseudonym } = useStore;
</script>
