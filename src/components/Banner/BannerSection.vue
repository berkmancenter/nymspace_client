<template>
  <div class="bg-gray-200 p-4">
    <div class="text-center text-2xl p-4">
      Hello, [
      <select
        v-model="activeToken"
        :disabled="getGuestStatus"
        class="bg-gray-200 text-red-500"
        @change="activateToken"
      >
        <option
          v-for="pseudonym in getPseudonyms"
          class="text-red-500"
          :value="pseudonym.token"
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
import { onMounted, watch, ref } from "vue";
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

const activeToken = ref("");

async function registerOneTime() {
  await registerOnce();
}

async function activateToken() {
  await activatePseudonym(activeToken.value);
}

/**
 * handling logout case to update activeToken
 */
watch(
  () => getActivePseudonym.value?.token,
  (val, prevVal) => {
    if (val !== prevVal && val !== activeToken.value) {
      activeToken.value = val;
    }
  }
);

onMounted(async () => {
  if (getLoggedInStatus.value) {
    await activatePseudonym(getActivePseudonym.value?.token);
  }
  activeToken.value = getActivePseudonym.value?.token;
});
</script>
