<template>
  <div class="flex flex-col justify-between flex-1 p-4">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="cursor-pointer p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        @click="onChoiceClicked(item)"
      >
        <h3 class="text-md font-bold mb-1">{{ item.text }}</h3>
      </div>
    </div>
    <ChoiceInput />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChoiceInput from '../components/Polls/ChoiceInput.vue'

const items = ref([
  { id: 1, text: 'Choice 1' },
  { id: 2, text: 'Choice 2' },
  { id: 3, text: 'Choice 3' },
  { id: 4, text: 'Choice 4' },
  { id: 5, text: 'Choice 5' },
  { id: 6, text: 'Choice 6' },
  { id: 7, text: 'Choice 7' },
  { id: 8, text: 'Choice 8' },
  { id: 9, text: 'Choice 9' },
  { id: 10, text: 'Choice 10' }
])

function onChoiceClicked(item) {
  // Handle the card click event
  console.log('TODO: Clicked', item)
}
</script>

<style scoped>
.auto-rows {
  grid-auto-rows: minmax(100px, auto);
}
</style>
