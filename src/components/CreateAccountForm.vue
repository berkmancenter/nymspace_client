<template>
  <form @submit.prevent="register">
    <h1 class="text-center text-3xl font-bold">Signup</h1>
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
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="email"
      placeholder="Email (optional)"
      v-model="email"
    />
    <div class="flex gap-4 flex-col mt-4">
      <div>
        <input class="signup-btn" type="submit" value="Signup" />
      </div>
      <div>
        Already have a username?
        <router-link to="login" class="text-red-500 hover:underline font-bold"
          >Login</router-link
        >
      </div>
    </div>
    <div v-show="!isEmailValid" class="text-red-500 mt-5 w-full">
      * Please enter a valid email address
    </div>
    <div v-show="showError" class="text-red-500 mt-1 w-full">
      *
      {{ message }}
    </div>
    <div v-show="showSuccess" class="text-green-500 mt-5 w-full">
      {{ message }}
    </div>
    <div class="clear-both"></div>
  </form>
</template>
<script setup>
import { ref, computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
import userStore from "../composables/global/useStore";
const { registerUser } = userStore;
const router = useRouter();
const username = ref("");
const password = ref("");
const password2 = ref("");
const email = ref("");
const showError = ref(false);
const showSuccess = ref(false);
const message = ref("");

function register() {
  setError("", false);
  showError.value = false;
  if (checkFormValidity() && checkPasswordsMatch()) {
    registerUser(username.value, password.value)
      .then(() => {
        clearForm();
        message.value = "Register successful. Redirecting to home page.";
        showSuccess.value = true;
        setTimeout(() => {
          router.push({ name: "home.featured" });
        }, 2000);
      })
      .catch((x) => setError(x.response.data.message, true));
  }
}

function setError(msg, flag) {
  message.value = msg;
  showError.value = flag;
}

const isEmailValid = computed(() => {
  if (email.value.trim().length == 0) return true;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value);
});

function checkFormValidity() {
  const isFormValid =
    username.value?.trim().length > 0 &&
    password.value?.trim().length > 0 &&
    password2.value?.trim().length > 0 &&
    isEmailValid;

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

function clearForm() {
  username.value = "";
  password.value = "";
  password2.value = "";
  email.value = "";
}
</script>
<style scoped>
.signup-btn {
  @apply w-full text-center  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
