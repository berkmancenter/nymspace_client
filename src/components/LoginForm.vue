<template>
  <form @submit.prevent="login">
    <h1 class="text-xl font-bold">Login</h1>
    <p class="mt-4">Log in to retain a pseudonym across sessions, develop reputation, and create channels:</p>
    <input
      v-model="username"
      class="border rounded border-gray-500 w-full h-12 px-3 text-lg mt-4 login-form-field"
      type="text"
      placeholder="username"
    />
    <input
      v-model="password"
      class="border rounded border-gray-500 w-full h-12 px-3 text-lg mt-4 login-form-field"
      type="password"
      placeholder="password"
    />
    <div class="flex gap-4 flex-col mt-4">
      <div>
        <button
          type="submit"
          class="w-full rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          Login
        </button>
      </div>
      <div>
        Don't have a username?
        <router-link to="create-account" class="underline">Signup</router-link>
      </div>
      <div>
        Forgot password?
        <router-link to="reset" class="underline">Reset password</router-link>
      </div>
    </div>

    <div v-show="showError" class="text-harvard-red mt-5 w-full border-harvard-red">
      *
      {{ errorMessage }}
    </div>
    <div class="clear-both"></div>
  </form>
</template>
<script setup>
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import userStore from '../composables/global/useStore'

const { loginUser } = userStore
const router = useRouter()
const username = ref('')
const password = ref('')
const showError = ref(false)
const errorMessage = ref('')

/**
 * Login method to validate form and call login api
 * Navigate to home page or previous page
 */
function login() {
  setError('', false)
  showError.value = false
  if (isFormValid()) {
    loginUser(username.value, password.value)
      .then(() => {
        if (router.currentRoute.value.query.to) {
          router.push({ path: router.currentRoute.value.query.to })
        } else {
          router.push({ name: 'home.channelspage' })
        }
      })
      .catch((x) => setError(x.response.data.message, true))
  } else {
    setError('Username and Password required', true)
  }
}

function setError(msg, flag) {
  errorMessage.value = msg
  showError.value = flag
}

function isFormValid() {
  return username.value?.trim().length > 0 && password.value?.trim().length > 0
}
</script>
<style scoped>
.log-in-btn {
  @apply w-full text-center  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
