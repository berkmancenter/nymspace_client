<template>
  <div class="absolute inset-0 flex flex-col overflow-hidden">
    <div class="flex-shrink-0 p-4 border-b bg-gray-50 truncate">
      <button class="sm:hidden text-md flex items-center gap-1" @click="$emit('close')">
        <ReplyIcon class="w-5 h-5" />
        Back
      </button>
      <div class="flex items-center justify-between truncate">
        <h3 class="font-semibold text-lg truncate sm:flex-1">
          <HiddenPseudonym v-if="parentMessage.pseudonym === null" />
          <span v-else class="font-semibold">{{ parentMessage.pseudonym }}</span>
        </h3>

        <div class="hidden sm:block">
          <XIcon class="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" @click="$emit('close')" />
        </div>
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
      <div class="mt-2 text-xs text-gray-500">{{ replyCount }} {{ replyCount === 1 ? 'reply' : 'replies' }}</div>
    </div>

    <div ref="repliesContainer" class="flex-1 overflow-y-auto p-4">
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
      <div v-else-if="replies.length === 0" class="text-center text-gray-500 mt-8">No replies yet.</div>
      <div v-else class="space-y-4">
        <div v-for="reply in replies" :key="reply.id || reply._id" class="group">
          <div class="flex items-start gap-2">
            <div class="flex-1 truncate">
              <div class="flex items-center gap-2 mb-1">
                <HiddenPseudonym v-if="reply.pseudonym === null" />
                <span v-else class="font-semibold text-sm truncate">{{ reply.pseudonym }}</span>
                <span v-if="reply.owner === userId" class="text-xs text-gray-500">(you)</span>
                <span class="text-xs text-gray-500 truncate">
                  {{
                    new Date(reply.createdAt).toLocaleString('en-US', {
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

    <div class="relative">
      <span
        v-if="newMessagesNotice"
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 px-3 py-1 text-xs text-white bg-harvard-red rounded cursor-pointer hover:bg-red-700 whitespace-nowrap"
        @click="onNewMessagesClick"
      >
        New replies
      </span>
    </div>

    <div v-if="threadLocked" class="text-center text-yellow-800 bg-yellow-100 p-2 rounded text-xs">
      This thread is locked. Replies cannot be sent until it is unlocked by the thread creator.
    </div>
    <div v-else class="border-t p-4">
      <MessageInput
        v-model="replyText"
        placeholder="Reply..."
        :max-length="maxReplyLength"
        :sending="sending"
        :textarea-class="'w-full p-2 border-0 rounded-md resize-none text-sm outline-none'"
        test-id="reply-text-area"
        @send="sendReply"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { XIcon, ReplyIcon } from '@heroicons/vue/outline'
import HiddenMessage from './HiddenMessage.vue'
import HiddenPseudonym from './HiddenPseudonym.vue'
import MessageInput from './MessageInput.vue'
import useStore from '../../composables/global/useStore'
import { useMessageScroll } from '../../composables/useMessageScroll'

const { getMaxMessageLength } = useStore

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
  },
  threadLocked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'send-reply'])

const replyText = ref('')
const sending = ref(false)
const repliesContainer = ref(null)

const replyCount = computed(() => props.replies.length)
const maxReplyLength = computed(() => getMaxMessageLength.value)

const { newMessagesNotice, scrollToBottom, handleNewMessage, onNewMessagesClick } = useMessageScroll({
  containerRef: repliesContainer,
  userId: props.userId
})

onMounted(async () => {
  scrollToBottom()
})

watch(
  () => props.replies,
  async (newReplies, oldReplies) => {
    if (!oldReplies || newReplies.length > oldReplies.length) {
      await nextTick()

      if (oldReplies && oldReplies.length > 0) {
        const newestReply = newReplies[newReplies.length - 1]
        if (newestReply) {
          handleNewMessage(newestReply)
        }
      }
    }
  },
  { deep: true }
)

watch(
  () => props.parentMessage,
  async (newParent) => {
    if (newParent) {
      await nextTick()
    }
  },
  { immediate: true }
)

async function sendReply(messageText) {
  if (!messageText.trim() || sending.value) return

  sending.value = true
  emit('send-reply', messageText)
  replyText.value = ''
  sending.value = false

  scrollToBottom()
}
</script>
