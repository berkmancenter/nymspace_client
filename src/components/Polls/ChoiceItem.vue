<template>
  <!-- Threshold reached choice -->
  <div
    v-if="choice.votes >= threshold"
    class="p-2 align-choices-center bg-green-50 border-green-500 border-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
    @click="onResponseClicked(choice)"
  >
    <p class="text-sm">{{ choice.text }}</p>
  </div>
  <!-- Locked choice -->
  <div
    v-else
    class="p-2 align-choices-center rounded-lg border border-gray-200 shadow-md"
    :class="props.isExpired ? 'bg-gray-100' : 'bg-white hover:shadow-lg cursor-pointer'"
  >
    <p class="text-sm">{{ choice.text }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  choice: {
    type: Object,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  isExpired: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()

function onResponseClicked(choice) {
  const thresholdReached = choice.votes >= props.threshold
  if (props.isExpired && !thresholdReached) {
    return
  }
  if (thresholdReached) {
    router.push({ name: 'home.polls.results', params: { responseId: choice.id } })
  }
}
</script>
