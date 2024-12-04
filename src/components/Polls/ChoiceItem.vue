<template>
  <!-- Threshold reached item -->
  <div
    v-if="item.votes >= thresholdValue"
    class="cursor-pointer p-2 align-items-center bg-green-50 border-green-500 border-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    @click="onChoiceClicked(item)"
  >
    <p class="text-sm">{{ item.title }}</p>
  </div>
  <!-- Locked item -->
  <div v-else class="p-2 align-items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
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
  }
})

const router = useRouter()

function onChoiceClicked(item) {
  if (item.votes >= props.thresholdValue) {
    router.push({ name: 'home.polls.results', params: { choiceId: item.id } })
  }
}
</script>
