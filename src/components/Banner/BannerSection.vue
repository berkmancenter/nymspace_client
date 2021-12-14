<template>
  <div class="bg-gray-200 p-4">
    <div class="text-center text-2xl p-4">
      Hello, [<select
        :disabled="getGuestStatus"
        class="bg-gray-200 text-red-500"
      >
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
import useStore from "../../composables/global/useStore";
import { defineAsyncComponent } from "@vue/runtime-core";

const { getLoggedInStatus, getPseudonym, registerOnce, getGuestStatus } =
  useStore;

function registerOneTime() {
  registerOnce();
}
</script>
