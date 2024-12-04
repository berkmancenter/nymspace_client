<template>
  <!-- Threshold reached item -->
  <div
    v-if="item.votes >= thresholdValue"
    class="cursor-pointer p-2 align-items-center bg-green-50 border-green-500 border-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    @click="onChoiceClicked"
  >
    <p class="text-sm">{{ item.text }}</p>
  </div>
  <!-- Locked item -->
  <div v-else class="p-2 align-items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <p class="text-sm">{{ item.text }}</p>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  thresholdValue: {
    type: Number,
    required: true
  }
})

function onChoiceClicked(item) {
  // Handle the card click event
  console.log('TODO: Clicked', item)
}
</script>
