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
        getLoggedInStatus
          ? defineAsyncComponent(() => import('./LoggedInBanner.vue'))
          : defineAsyncComponent(() => import('./GuestBanner.vue'))
      "
      @login="registerOneTime"
    ></component>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import useStore from "../../composables/global/useStore";
import { computed } from "@vue/reactivity";
import { defineAsyncComponent } from "@vue/runtime-core";

const router = useRouter();
const { getLoggedInStatus, getUserToken, getPseudonym, registerOnce } =
  useStore;

function registerOneTime() {
  registerOnce();
}
</script>
