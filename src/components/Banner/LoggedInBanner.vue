<template>
  <div class="mx-auto w-11/12 lg:w-3/5 grid lg:grid-flow-col sm:grid-col-row">
    <div class="px-1 py-3 text-lg self-start">
      <button class="btn" @click="signout">
        Create a new pseudonym for one session (log out)
      </button>
    </div>
    <div class="px-1 py-3 text-lg grid grid-flow-row">
      <div>
        <button class="btn">
          <router-link to="/login">
            Stay logged in
            <span class="text-gray-600 text-sm ml-2"
              >retain a pseudonym across sessions</span
            >
          </router-link>
        </button>
      </div>
      <div>
        <button class="btn">
          <router-link to="/login">
            <RefreshIcon class="ml-1 h6 w-6 inline-block" /> Create a new
            pseudonym on your account
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import store from "../../composables/global/useStore";
import { RefreshIcon } from "@heroicons/vue/outline";
const props = defineProps({
  userToken: {
    type: String,
    required: true,
  },
});
const router = useRouter();
const { logout } = store;
async function signout() {
  await logout();
  router.push({ name: "home.featured" });
}
</script>

<style scoped>
.btn {
  @apply min-w-full my-1 bg-white border-2 border-gray-500 text-lg h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
