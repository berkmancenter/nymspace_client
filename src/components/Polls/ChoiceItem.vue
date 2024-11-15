<template>
  <div
    class="cursor-pointer p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    @click="onChoiceClicked"
  >
    <h3 class="text-md font-bold mb-1">{{ item.text }}</h3>
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
