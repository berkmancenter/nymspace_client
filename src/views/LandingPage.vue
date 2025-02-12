<template>
  <div class="flex flex-col justify-center flex-1 sm:mx-auto sm:flex-1 sm:w-11/12 lg:w-3/5">
    <Channels :channels="channelsWithFollow" />
  </div>
</template>
<script setup>
import Channels from '../components/Channels/Channels.vue'
import { computed, onMounted } from 'vue'
import useStore from '../composables/global/useStore'
const { loadChannels, getChannels, getUserChannels, loadUserChannels, loadConfig } = useStore
// const searchText = ref('')

const channelsWithFollow = computed(() => {
  return getChannels.value.map((x) => ({
    ...x,
    isFollowed: getUserChannels.value.some(
      (y) => y.id === x.id && Object.prototype.hasOwnProperty.call(y, 'followed') && y.followed
    )
  }))
})

onMounted(async () => {
  await loadConfig()
  await loadUserChannels()
  await loadChannels()
})
</script>
