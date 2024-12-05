<template>
  <!-- Threshold reached item -->
  <div
    v-if="item.votes >= thresholdValue"
    class="p-2 align-items-center bg-green-50 border-green-500 border-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
    @click="onChoiceClicked(item)"
  >
    <p class="text-sm">{{ item.title }}</p>
  </div>
  <!-- Locked item -->
  <div
    v-else
    class="p-2 align-items-center rounded-lg border border-gray-200 shadow-md"
    :class="props.isExpired ? 'bg-gray-100' : 'bg-white hover:shadow-lg cursor-pointer'"
  >
    <p class="text-sm">{{ item.title }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  thresholdValue: {
    type: Number,
    required: true
  },
  isExpired: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()

function onChoiceClicked(item) {
  const thresholdReached = item.votes >= props.thresholdValue
  if (props.isExpired && !thresholdReached) {
    return
  }
  if (thresholdReached) {
    router.push({ name: 'home.polls.results', params: { choiceId: item.id } })
  }
}
</script>
