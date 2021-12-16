<template>
  <div class="bg-gray-200 p-4">
    <div class="text-center text-2xl p-4">
      Hello, [<select
        :disabled="getGuestStatus"
        class="bg-gray-200 text-red-500"
      >
        <option
          v-for="pseudonym in getPseudonyms"
          class="text-red-500"
          :value="pseudonym.token"
          :selected="pseudonym.token === getActivePseudonym.token"
        >
          {{ pseudonym.pseudonym }}
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
import { onMounted } from "vue";
import useStore from "../../composables/global/useStore";
import { defineAsyncComponent } from "@vue/runtime-core";

const {
  getLoggedInStatus,
  getPseudonyms,
  getActivePseudonym,
  registerOnce,
  getGuestStatus,
  activatePseudonym,
} = useStore;

function registerOneTime() {
  registerOnce();
}

onMounted(async () => {
  if (getLoggedInStatus.value) {
    await activatePseudonym();
  }
});
</script>
