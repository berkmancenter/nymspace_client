<template>
  <form @submit.prevent="reset" class="flex flex-col items-center">
    <h1 class="text-center text-3xl font-bold">Forgot Password</h1>
    <template v-if="isLinkSent">
      <div class="mt-8">
        <CheckCircleIcon class="w-28 h-w-28 text-green-500" />
      </div>
      <div class="mt-4 text-2xl">
        If your email address exists, a password reset instruction email will be
        sent to you.
      </div>
    </template>
    <div class="w-96">
      <template v-if="!isLinkSent">
        <p class="mt-4">
          Please enter you registered email to get the password reset email.
        </p>
        <input
          class="border rounded border-gray-500 w-full h-12 px-3 text-lg mt-4 login-form-field"
          type="text"
          placeholder="email"
          v-model="email"
        />
        <button
          class="mt-2 w-full rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          type="submit"
        >
          Reset
        </button>
      </template>

      <div class="flex gap-4 flex-col mt-4 items-center">
        <div></div>
        <div>
          Don't have a username?
          <router-link
            to="create-account"
            class="text-harvard-red hover:underline font-bold"
            >Signup</router-link
          >
        </div>
        <div>
          Already have a username?
          <router-link
            to="login"
            class="text-harvard-red hover:underline font-bold"
            >Login</router-link
          >
        </div>
      </div>

      <div
        v-show="showError"
        class="text-harvard-red mt-5 w-full border-harvard-red"
      >
        *
        {{ errorMessage }}
      </div>
      <div class="clear-both"></div>
    </div>
  </form>
</template>
<script setup>
import { ref, computed } from "@vue/reactivity";
import userStore from "../composables/global/useStore";
import { CheckCircleIcon } from "@heroicons/vue/outline";

const { forgotPassword } = userStore;
const email = ref("");
const showError = ref(false);
const errorMessage = ref("");
const isLinkSent = ref(false);

const isEmailValid = computed(() => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value);
});

/**
 * Reset method to send password reset instruction email
 */
async function reset() {
  setError("", false);
  showError.value = false;
  if (isEmailValid.value) {
    await forgotPassword(email.value)
      .then(() => {
        setError("", false);
        isLinkSent.value = true;
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
  } else {
    setError("Please enter valid email", true);
  }
}

function setError(msg, flag) {
  errorMessage.value = msg;
  showError.value = flag;
}
</script>
<style scoped>
.log-in-btn {
  @apply w-full text-center  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
