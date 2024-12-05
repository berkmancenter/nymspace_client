<template>
  <!-- Poll result view -->
  <div v-if="response && response.votes >= thresholdValue" class="px-4">
    <div class="flex content-center mb-2 py-4">
      <button class="mr-4" @click="navigateBack">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <div>
        <h2 class="text-lg font-bold">{{ response.title }}</h2>
        <p class="text-sm">
          This option reached the threshold of {{ thresholdValue }}. The people who chose this option are shown below.
        </p>
        <div class="flex mt-2">
          <div class="bg-green-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
            Votes: {{ response.votes }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex">
        <div v-for="voter in response.voters" :key="voter" class="bg-white rounded-lg shadow-md px-6 py-2 m-4">
          {{ voter }}
        </div>
      </div>
    </div>
  </div>
  <!-- Grid of responses -->
  <div v-else class="flex flex-col justify-between flex-1 p-4">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows">
      <template v-for="item in items" :key="item.id">
        <ResponseItem :item="item" :threshold-value="thresholdValue" :is-expired="isExpired" />
      </template>
    </div>
    <ResponseInput v-if="!isExpired" />
    <p v-else class="text-gray-700 text-sm text-center">
      This poll has ended and no new votes can be cast. <br />
      Start a new one at any time!
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ResponseInput from '../components/Polls/ResponseInput.vue'
import ResponseItem from '../components/Polls/ResponseItem.vue'
import { ChevronLeftIcon } from '@heroicons/vue/outline'

const route = useRoute()
const router = useRouter()

const thresholdValue = 5

const responseId = computed(() => route.params.responseId)
const response = computed(() => items.value.find((item) => item.id === parseInt(responseId.value)))

const isExpired = ref(true)

const items = ref([
  { id: 1, title: 'See Wicked on Broadway', votes: 3, voters: ['Alice', 'Bob', 'Charlie'] },
  { id: 2, title: 'Visit the Natural History Museum', votes: 7, voters: ['Dave', 'Eve', 'Frank'] },
  { id: 3, title: 'Chill at home', votes: 3, voters: ['Grace', 'Heidi', 'Ivan'] },
  { id: 4, title: 'Go to the Met', votes: 2, voters: ['Judy', 'Karl'] },
  { id: 5, title: 'Go shopping', votes: 5, voters: ['Liam', 'Mia', 'Noah'] }
])

function navigateBack() {
  router.push({ name: 'home.polls', params: { pollId: route.params.pollId } })
}
</script>

<style scoped>
.auto-rows {
  grid-auto-rows: minmax(40px, auto);
}
</style>
