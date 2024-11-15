<template>
  <div class="flex flex-col justify-between flex-1 p-4">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <template v-for="item in items" :key="item.id">
        <ChoiceItem :item="item" :threshold-value="thresholdValue" />
      </template>
    </div>
    <ChoiceInput />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChoiceInput from '../components/Polls/ChoiceInput.vue'
import ChoiceItem from '../components/Polls/ChoiceItem.vue'

const thresholdValue = 5

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
</script>

<style scoped>
.auto-rows {
  grid-auto-rows: minmax(100px, auto);
}
</style>
