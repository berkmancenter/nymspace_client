<template>
  <div class="relative">
    <div class="block p-1 text-sm border rounded shadow-sm" :class="hasError ? 'border-harvard-red' : 'border-gray-500'">
      <textarea
        id="messageTextArea"
        ref="textareaRef"
        v-model="messageText"
        :class="textareaClass"
        :placeholder="placeholder"
        :disabled="disabled || sending"
        :data-testid="testId"
        :rows="rows"
        @keydown.enter.prevent="handleSend"
        @keypress="$emit('keypress', $event)"
        @input="$emit('input', $event)"
      />

      <button
        class="flex justify-end w-full text-black"
        :disabled="!canSend"
        :class="!canSend ? 'text-gray-400' : ''"
        @click="handleSend"
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

    <p class="text-xs mt-1">
      <span :class="messageText.length >= maxLength ? 'text-harvard-red' : ''">{{ messageText.length }}</span>
      /{{ maxLength }} character limit
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Message (hit enter to send)'
  },
  maxLength: {
    type: Number,
    default: 2000
  },
  disabled: {
    type: Boolean,
    default: false
  },
  sending: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  },
  textareaClass: {
    type: String,
    default: 'w-full h-20 bg-white outline-none'
  },
  testId: {
    type: String,
    default: 'message-text-area'
  },
  rows: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'send', 'keypress', 'input'])

const textareaRef = ref(null)
const messageText = ref(props.modelValue)

const canSend = computed(() => {
  return (
    messageText.value.trim().length > 0 && messageText.value.length <= props.maxLength && !props.disabled && !props.sending
  )
})

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    messageText.value = newValue
  }
)

// Emit changes to parent
watch(messageText, (newValue) => {
  emit('update:modelValue', newValue)
})

function handleSend() {
  if (canSend.value) {
    emit('send', messageText.value)
  }
}

function focus() {
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

function clear() {
  messageText.value = ''
}

defineExpose({
  focus,
  clear,
  textareaRef
})
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
