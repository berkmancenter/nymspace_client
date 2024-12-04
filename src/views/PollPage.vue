<template>
  <div class="flex flex-col justify-between flex-1 p-4">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows">
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
  { id: 1, text: 'See Wicked on Broadway', votes: 3 },
  { id: 2, text: 'Visit the Natural History Museum', votes: 7 },
  { id: 3, text: 'Chill at home', votes: 3 },
  { id: 4, text: 'Go to the Met', votes: 2 },
  { id: 5, text: 'Go shopping', votes: 5 }
])
</script>

<style scoped>
.auto-rows {
  grid-auto-rows: minmax(40px, auto);
}
</style>
