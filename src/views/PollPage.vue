<template>
  <div class="flex flex-col justify-start flex-1 p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="cursor-pointer p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        @click="onChoiceClicked(item)"
      >
        <h3 class="text-lg font-bold mb-1">{{ item.title }}</h3>
        <p class="text-gray-600">{{ item.description }}</p>
      </div>
    </div>
    <p>TODO Choice input</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, title: 'Choice 1', description: 'Description for Choice 1' },
  { id: 2, title: 'Choice 2', description: 'Description for Choice 2' },
  { id: 3, title: 'Choice 3', description: 'Description for Choice 3' },
  { id: 4, title: 'Choice 4', description: 'Description for Choice 4' },
  { id: 5, title: 'Choice 5', description: 'Description for Choice 5' },
  { id: 6, title: 'Choice 6', description: 'Description for Choice 6' },
  { id: 7, title: 'Choice 7', description: 'Description for Choice 7' },
  { id: 8, title: 'Choice 8', description: 'Description for Choice 8' },
  { id: 9, title: 'Choice 9', description: 'Description for Choice 9' },
  { id: 10, title: 'Choice 10', description: 'Description for Choice 10' }
])

function onChoiceClicked(item) {
  // Handle the card click event
  console.log('TODO: Clicked', item)
}
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
}
</style>
