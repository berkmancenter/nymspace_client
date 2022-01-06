<template>
  <form @submit.prevent="reset" class="flex flex-col items-center">
    <h1 class="text-center text-3xl font-bold">Reset Password</h1>
    <template v-if="isDone">
      <div class="mt-8">
        <CheckCircleIcon class="w-28 h-w-28 text-green-500" />
      </div>
      <div class="mt-4 text-2xl">
        Password changed successfully.
        <router-link to="login" class="text-red-500 hover:underline font-bold"
          >Login</router-link
        >
        to use the threads application.
      </div>
    </template>
    <div class="w-96">
      <template v-if="!isDone">
        <p class="mt-4">Please enter password to reset.</p>
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
        <input class="log-in-btn mt-4" type="submit" value="Reset Password" />
      </template>
      <div v-show="showError" class="text-red-500 mt-5 w-full border-red-500">
        *
        {{ errorMessage }}
      </div>
      <div class="clear-both"></div>
    </div>
  </form>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import userStore from "../composables/global/useStore";
import { CheckCircleIcon } from "@heroicons/vue/outline";
import util from "../utils";
const { resetPassword } = userStore;

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
});

const errorMessage = ref("");
const isDone = ref(false);
const password = ref("");
const password2 = ref("");
const showError = ref(false);

/**
 * Reset method to send password reset instruction email
 */
async function reset() {
  setError("", false);
  showError.value = false;
  if (checkFormValidity() && checkPasswordsMatch()) {
    await resetPassword(password.value, props.token)
      .then(() => {
        setError("", false);
        isDone.value = true;
      })
      .catch((x) => {
        if (x.isAxiosError) {
          setError(
            "Timeout while requesting password reset. Please contact administrator.",
            true
          );
        }
        if (x.response) {
          setError(x.response.data.message, true);
        }
      });
  }
}

function setError(msg, flag) {
  errorMessage.value = util.changeToTitle(msg);
  showError.value = flag;
}

function checkFormValidity() {
  const isFormValid =
    password.value?.trim().length > 0 && password2.value?.trim().length > 0;

  if (!isFormValid) {
    setError("Password is required", true);
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
  @apply w-full text-center  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
