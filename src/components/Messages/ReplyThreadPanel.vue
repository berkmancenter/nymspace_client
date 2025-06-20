<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">
          <HiddenPseudonym v-if="parentMessage.pseudonym === null" />
          <span v-else class="font-semibold">{{ parentMessage.pseudonym }}</span>
        </h3>
        <XIcon class="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" @click="$emit('close')" />
      </div>

      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs text-gray-500">
          {{
            new Date(parentMessage.createdAt)
              .toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
              .split(',')
              .join(' at ')
          }}
        </span>
      </div>
      <div v-if="parentMessage.body" class="text-sm">{{ parentMessage.body }}</div>
      <HiddenMessage v-else />
      <div class="mt-2 text-xs text-gray-500">
        {{ replyCount }} {{ replyCount === 1 ? 'reply' : 'replies' }}
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="loading" class="flex justify-center items-center h-32">
        <svg class="w-8 h-8 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <div v-else-if="replies.length === 0" class="text-center text-gray-500 mt-8">
        No replies yet.
      </div>
      <div v-else class="space-y-4">
        <div v-for="reply in replies" :key="reply.id || reply._id" class="group">
          <div class="flex items-start gap-2">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <HiddenPseudonym v-if="reply.pseudonym === null" />
                <span v-else class="font-semibold text-sm">{{ reply.pseudonym }}</span>
                <span v-if="reply.owner === userId" class="text-xs text-gray-500">(you)</span>
                <span class="text-xs text-gray-500">
                  {{
                    new Date(reply.createdAt)
                      .toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                  }}
                </span>
              </div>
              <div v-if="reply.body" class="text-sm">{{ reply.body }}</div>
              <HiddenMessage v-else class="max-w-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t p-4">
      <div class="relative">
        <textarea
          v-model="replyText"
          placeholder="Reply..."
          class="w-full p-2 border rounded-md resize-none text-sm"
          rows="3"
          @keydown.enter.prevent="sendReply"
        ></textarea>
        <button
          @click="sendReply"
          :disabled="!replyText.trim() || sending"
          class="absolute bottom-2 right-2 p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { XIcon } from '@heroicons/vue/outline'
import HiddenMessage from './HiddenMessage.vue'
import HiddenPseudonym from './HiddenPseudonym.vue'

const props = defineProps({
  parentMessage: {
    type: Object,
    default: null
  },
  replies: {
    type: Array,
    default: () => []
  },
  userId: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'send-reply'])

const replyText = ref('')
const sending = ref(false)

const replyCount = computed(() => props.replies.length)

async function sendReply() {
  if (!replyText.value.trim() || sending.value) return

  sending.value = true
  emit('send-reply', replyText.value)
  replyText.value = ''
  sending.value = false
}

watch(() => props.parentMessage, () => {
  replyText.value = ''
})
</script>