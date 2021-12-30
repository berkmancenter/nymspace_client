<template>
  <div class="mx-auto w-11/12 lg:w-3/5 flex gap-2 md:gap-4">
    <div
      class="w-full px-2 h-16 leading-relaxed self-cente flex justify-center items-center my-2"
      v-if="getGuestStatus"
    >
      <span>Keep using this one-time pseudonym, or</span>
    </div>
    <button v-else class="btn" @click="signout">
      <span>Create a new pseudonym for one session (log out)</span>
    </button>
    <button
      :disabled="getPseudonyms.length >= 5"
      class="btn"
      v-if="!getGuestStatus"
      @click="createPseudonym"
      :title="getNewPseudonymButtonTitle()"
    >
      <RefreshIcon class="ml-1 h6 w-6 inline-block" /> Create a new pseudonym on
      your account
    </button>
    <button class="btn" v-else @click="loginViaGuest">Login</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import store from "../../composables/global/useStore";
import { RefreshIcon } from "@heroicons/vue/outline";

const emit = defineEmits(["create-pseudonym"]);
const router = useRouter();
const { logout, getGuestStatus, createNewPseudonym, getPseudonyms } = store;

async function signout() {
  logout();
  router.push({ name: "home.featured" });
}

/**
 * Go to login page from guest session
 * Logout guest user and pass current page
 * so the after loggin in, app can navigate
 * to same page
 */
function loginViaGuest() {
  router.push({
    name: "home.login",
    query: {
      to: router.currentRoute.value.path,
    },
  });
}

async function createPseudonym() {
  await createNewPseudonym();
  emit("create-pseudonym");
}

function getNewPseudonymButtonTitle() {
  if (getPseudonyms.value.length >= 5)
    return "Maximum of five pseudonyms reached.";
  return "";
}
</script>

<style scoped>
.btn {
  @apply w-full bg-white border-2 border-gray-500 text-base px-2 h-16 leading-relaxed hover:bg-gray-200 cursor-pointer md:text-lg md:px-1;
}

.btn:disabled {
  @apply cursor-not-allowed bg-gray-200;
}
</style>
