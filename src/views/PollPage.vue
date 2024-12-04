<template>
  <!-- Poll result view -->
  <div v-if="choice && choice.votes >= thresholdValue">
    <h2 class="text-lg font-bold mb-4">Poll Result for Choice: {{ choice.title }}</h2>
    <p class="text-gray-600 mb-4">Votes: {{ choice.votes }}</p>
    <ul class="list-disc pl-5 mb-4">
      <li v-for="voter in choice.voters" :key="voter">{{ voter }}</li>
    </ul>
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      @click="goBack"
    >
      Back to All Responses
    </button>
  </div>
  <!-- Grid of choices -->
  <div v-else class="flex flex-col justify-between flex-1 p-4">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows">
      <template v-for="item in items" :key="item.id">
        <ChoiceItem :item="item" :threshold-value="thresholdValue" />
      </template>
    </div>
    <ChoiceInput />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChoiceInput from '../components/Polls/ChoiceInput.vue'
import ChoiceItem from '../components/Polls/ChoiceItem.vue'

const route = useRoute()
const router = useRouter()

const thresholdValue = 5

const choiceId = computed(() => route.params.choiceId)
const choice = computed(() => items.value.find((item) => item.id === parseInt(choiceId.value)))

const items = ref([
  { id: 1, title: 'See Wicked on Broadway', votes: 3, voters: ['Alice', 'Bob', 'Charlie'] },
  { id: 2, title: 'Visit the Natural History Museum', votes: 7, voters: ['Dave', 'Eve', 'Frank'] },
  { id: 3, title: 'Chill at home', votes: 3, voters: ['Grace', 'Heidi', 'Ivan'] },
  { id: 4, title: 'Go to the Met', votes: 2, voters: ['Judy', 'Karl'] },
  { id: 5, title: 'Go shopping', votes: 5, voters: ['Liam', 'Mia', 'Noah'] }
])

function goBack() {
  router.push({ name: 'home.polls', params: { pollId: route.params.pollId } })
}
</script>

<style scoped>
.auto-rows {
  grid-auto-rows: minmax(40px, auto);
}
</style>
