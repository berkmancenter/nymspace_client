<template>
  <form @submit.prevent="register">
    <p class="mt-4">
      Create an account to be able to login on this application:
    </p>
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="text"
      placeholder="new username"
      v-model="username"
    />
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="password"
      placeholder="password"
      v-model="password"
    />
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="password"
      placeholder="confirm password"
      v-model="password2"
    />
    <input class="log-in-btn" type="submit" value="create account" />
    <div
      v-show="showError"
      class="text-red-500 float-left md:ml-5 mt-5 text-center w-full md:w-auto"
    >
      {{ message }}
    </div>
    <div
      v-show="showSuccess"
      class="text-green-500 float-left md:ml-5 mt-5 text-center w-full md:w-auto"
    >
      {{ message }}
    </div>
    <div class="clear-both"></div>
  </form>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import userStore from "../composables/global/useStore";
const { registerUser } = userStore;
const router = useRouter();
const username = ref("");
const password = ref("");
const password2 = ref("");
const showError = ref(false);
const showSuccess = ref(false);
const message = ref("");

function register() {
  setError("", false);
  showError.value = false;
  if (checkFormValidity() && checkPasswordsMatch()) {
    registerUser(username.value, password.value)
      .then(() => {
        message.value = "Register successful. Redirecting to home page.";
        showSuccess.value = true;
        setTimeout(() => {
          router.push({ name: "home.featured" });
        }, 3000);
      })
      .catch((x) => setError(x.response.data.message, true));
  }
}

function setError(msg, flag) {
  message.value = msg;
  showError.value = flag;
}

function checkFormValidity() {
  const isFormValid =
    username.value?.trim().length > 0 &&
    password.value?.trim().length > 0 &&
    password2.value?.trim().length > 0;

  if (!isFormValid) {
    setError("All fields are required", true);
  }

  return isFormValid;
}
function checkPasswordsMatch() {
  let isMatching = password.value?.trim() === password2.value?.trim();
  if (!isMatching) {
    setError("Passwords should be same", true);
  }
  return isMatching;
}
</script>
<style scoped>
.log-in-btn {
  @apply w-full md:w-auto text-center float-left bg-white border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
