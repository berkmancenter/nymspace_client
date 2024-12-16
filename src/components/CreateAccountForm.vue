<template>
  <form @submit.prevent="register">
    <h1 class="text-xl font-bold">Signup</h1>
    <p class="mt-4">Create an account to be able to login on this application:</p>
    <input
      v-model="username"
      class="w-full h-12 px-3 mt-4 text-lg border border-gray-500 rounded login-form-field"
      type="text"
      placeholder="new username"
    />
    <input
      v-model="password"
      class="w-full h-12 px-3 mt-4 text-lg border border-gray-500 rounded login-form-field"
      type="password"
      placeholder="password"
    />
    <input
      v-model="password2"
      class="w-full h-12 px-3 mt-4 text-lg border border-gray-500 rounded login-form-field"
      type="password"
      placeholder="confirm password"
    />
    <input
      v-model="email"
      class="w-full h-12 px-3 mt-4 text-lg border border-gray-500 rounded login-form-field"
      type="email"
      placeholder="Email (optional)"
    />
    <div class="flex flex-col gap-4 mt-4">
      <div>
        <button
          type="submit"
          class="w-full px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          Signup
        </button>
      </div>
      <div>
        Already have a username?
        <router-link :to="`${path}/login`" class="underline">Login</router-link>
      </div>
    </div>
    <div v-show="!isEmailValid" class="w-full mt-5 text-harvard-red">* Please enter a valid email address</div>
    <div v-show="showError" class="w-full mt-1 text-harvard-red">
      *
      {{ message }}
    </div>
    <div v-show="showSuccess" class="w-full mt-5 text-green-500">
      {{ message }}
    </div>
    <div class="clear-both"></div>
  </form>
</template>
<script setup>
import { ref, computed } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import userStore from '../composables/global/useStore'
const { registerUser } = userStore
const router = useRouter()
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
const username = ref('')
const password = ref('')
const password2 = ref('')
const email = ref('')
const showError = ref(false)
const showSuccess = ref(false)
const message = ref('')

function register() {
  setError('', false)
  showError.value = false
  if (checkFormValidity() && checkPasswordsMatch()) {
    registerUser(username.value, password.value, email.value)
      .then(() => {
        clearForm()
        message.value = 'Register successful. Redirecting...'
        showSuccess.value = true
        setTimeout(() => {
          if (router.currentRoute.value.query.to) {
            router.push({ path: router.currentRoute.value.query.to })
          } else {
            router.push({ name: 'home.channelspage' })
          }
        }, 500)
      })
      .catch((x) => setError(x.response.data.message, true))
  }
}

function setError(msg, flag) {
  message.value = msg
  showError.value = flag
}

const isEmailValid = computed(() => {
  if (email.value.trim().length === 0) return true
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
})

function checkFormValidity() {
  const isFormValid =
    username.value?.trim().length > 0 &&
    password.value?.trim().length > 0 &&
    password2.value?.trim().length > 0 &&
    isEmailValid

  if (!isFormValid) {
    setError('All fields (except email) are required', true)
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

function clearForm() {
  username.value = ''
  password.value = ''
  password2.value = ''
  email.value = ''
}
</script>
<style scoped>
.signup-btn {
  @apply w-full text-center  bg-white border-2 border-gray-500 text-lg px-10 h-10 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
