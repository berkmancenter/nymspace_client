<template>
  <div class="mt-4 flex flex-col">
    <div class="relative">
      <textarea
        v-model="responseText"
        placeholder="Add a response..."
        class="w-full p-2 border rounded-lg text-sm h-24"
      ></textarea>
      <button
        class="absolute bottom-2 right-2 p-2 text-black"
        :disabled="responseText.length > 249"
        :class="responseText.length > 249 ? 'text-gray-400' : ''"
        @click="sendResponse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="block w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
    <p class="text-xs mt-2">
      <span :class="responseText.length > 249 ? 'text-harvard-red' : ''">{{ responseText.length }}</span
      >/250 character limit
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useStore from '../../composables/global/useStore'

const { respondPoll, getActivePoll } = useStore

const responseText = ref('')

async function sendResponse() {
  if (responseText.value.length > 0 && responseText.value.length <= 250) {
    try {
      console.log(responseText.value)
      await respondPoll({
        pollId: getActivePoll.value._id,
        choiceText: responseText.value
      })
      responseText.value = ''
    } catch (error) {
      console.error('Error sending response:', error)
    }
  }
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
