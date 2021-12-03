<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="lg:w-1/2 lg:inline-block p-3 text-lg">
      <input type="radio" name="action" id="action-1" checked />
      <label for="action-1" @click="login">
        Use this pseudonym for one session
      </label>
    </div>
    <div class="lg:w-1/2 lg:inline-block p-3 text-lg">
      <router-link to="/login">
        <input type="radio" name="action" id="action-2" />
        <label for="action-2">
          Login
          <span class="text-gray-600 text-sm ml-2"
            >retain a pseudonym across sessions</span
          >
        </label>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  userToken: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["login"]);
</script>
