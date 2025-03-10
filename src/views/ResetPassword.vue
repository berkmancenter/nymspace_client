<template>
  <form class="flex flex-col items-center" @submit.prevent="reset">
    <h1 class="text-3xl font-bold text-center">Reset Password</h1>
    <template v-if="isDone">
      <div class="mt-8">
        <CheckCircleIcon class="text-green-500 w-28 h-w-28" />
      </div>
      <div class="mt-4 text-2xl">
        Password changed successfully.
        <router-link to="login" class="font-bold text-harvard-red hover:underline">Login</router-link>
        to use the threads application.
      </div>
    </template>
    <div class="w-96">
      <template v-if="!isDone">
        <p class="mt-4">Please enter password to reset.</p>
        <input
          v-model="password"
          class="w-full h-12 px-3 mt-4 text-lg border-2 border-gray-500"
          type="password"
          placeholder="password"
        />
        <input
          v-model="password2"
          class="w-full h-12 px-3 mt-4 text-lg border-2 border-gray-500"
          type="password"
          placeholder="confirm password"
        />
        <input class="mt-4 log-in-btn" type="submit" value="Reset Password" />
      </template>
      <div v-show="showError" class="w-full mt-5 text-harvard-red border-harvard-red">
        *
        {{ errorMessage }}
      </div>
      <div class="clear-both"></div>
    </div>
  </form>
</template>
<script setup>
import { ref } from '@vue/reactivity'
import userStore from '../composables/global/useStore'
import { CheckCircleIcon } from '@heroicons/vue/outline'
import util from '../utils'
const { resetPassword } = userStore

const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

const errorMessage = ref('')
const isDone = ref(false)
const password = ref('')
const password2 = ref('')
const showError = ref(false)

/**
 * Reset method to send password reset instruction email
 */
async function reset() {
  setError('', false)
  showError.value = false
  if (checkFormValidity() && checkPasswordsMatch()) {
    await resetPassword(password.value, props.token)
      .then(() => {
        setError('', false)
        isDone.value = true
      })
      .catch((x) => {
        if (x.isAxiosError) {
          setError('Timeout while requesting password reset. Please contact administrator.', true)
        }
        if (x.response) {
          setError(x.response.data.message, true)
        }
      })
  }
}

function setError(msg, flag) {
  errorMessage.value = util.changeToTitle(msg)
  showError.value = flag
}

function checkFormValidity() {
  const isFormValid = password.value?.trim().length > 0 && password2.value?.trim().length > 0

  if (!isFormValid) {
    setError('Password is required', true)
  }

  return isFormValid
}

function checkPasswordsMatch() {
  const isMatching = password.value?.trim() === password2.value?.trim()
  if (!isMatching) {
    setError('Passwords should be same', true)
  }
  return isMatching
}
</script>
<style scoped>
.log-in-btn {
  @apply w-full text-center  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
