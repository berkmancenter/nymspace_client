<template>
  <form @submit.prevent="login">
    <p class="mt-4">
      Log in to retain a pseudonym across sessions, develop reputation, and
      create channels:
    </p>
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4 login-form-field"
      type="text"
      placeholder="username"
      v-model="username"
    />
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4 login-form-field"
      type="password"
      placeholder="password"
      v-model="password"
    />
    <input class="log-in-btn" type="submit" value="log in" />
    <router-link class="create-account-btn" to="create-account"
      >create account</router-link
    >
    <div
      v-show="showError"
      class="text-red-500 float-left md:ml-5 mt-5 text-center w-full md:w-auto"
    >
      {{ errorMessage }}
    </div>
    <div class="clear-both"></div>
  </form>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import userStore from "../composables/global/useStore";
const { loginUser } = userStore;
const router = useRouter();
const username = ref("");
const password = ref("");
const showError = ref(false);
const errorMessage = ref("");

function login() {
  setError("", false);
  showError.value = false;
  if (isFormValid()) {
    loginUser(username.value, password.value)
      .then(() => router.push({ name: "home.featured" }))
      .catch((x) => setError(x.response.data.message, true));
  } else {
    setError("Usename and Password required", true);
  }
}

function setError(msg, flag) {
  errorMessage.value = msg;
  showError.value = flag;
}

function isFormValid() {
  return username.value?.trim().length > 0 && password.value?.trim().length > 0;
}
</script>
<style scoped>
.log-in-btn {
  @apply w-full md:w-auto text-center float-left bg-white border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-3 hover:bg-gray-100 cursor-pointer;
}
.create-account-btn {
  @apply w-full md:w-auto text-center float-left inline-block border-2 border-gray-500 text-lg px-10 h-10 md:ml-4 mt-4 leading-9 hover:bg-gray-100;
}
</style>
