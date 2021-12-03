<template>
  <div class="mx-auto w-11/12 lg:w-3/5 grid lg:grid-flow-col sm:grid-col-row">
    <div class="px-1 py-3 text-lg self-start">
      <input type="radio" name="action" id="action-1" checked />
      <label for="action-1" @click="login">
        Create a new pseudonym for one session (log out)
      </label>
    </div>
    <div class="px-1 py-3 text-lg grid grid-flow-row">
      <div>
        <router-link to="/login">
          <input type="radio" name="action" id="action-2" />
          <label for="action-2">
            Stay logged in
            <span class="text-gray-600 text-sm ml-2"
              >retain a pseudonym across sessions</span
            >
          </label>
        </router-link>
      </div>
      <div>
        <router-link to="/login">
          <input type="radio" name="action" id="action-2" />
          <label for="action-2">
            <RefreshIcon class="ml-1 h6 w-6 inline-block" /> Create a new
            pseudonym on your account
          </label>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RefreshIcon } from "@heroicons/vue/outline";
const props = defineProps({
  userToken: {
    type: String,
    required: true,
  },
});
</script>
