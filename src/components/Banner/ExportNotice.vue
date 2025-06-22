<template>
  <div v-if="showNotice && isGuest" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-yellow-800">
          Data Export Notice
        </h3>
        <div class="mt-2 text-sm text-yellow-700">
          <p>
            As a guest user, your messages may be included in data exports by thread owners.
            <router-link :to="{ name: 'home.createAccount' }" class="font-medium underline">
              Create an account
            </router-link>
            to be able to change pseudonyms and opt out of data exports.
          </p>
        </div>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="dismissNotice"
            type="button"
            class="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
          >
            <span class="sr-only">Dismiss</span>
            <XIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ExclamationIcon, XIcon } from '@heroicons/vue/solid'
import useStore from '../../composables/global/useStore'

export default {
  name: 'ExportNotice',
  components: {
    ExclamationIcon,
    XIcon
  },
  setup() {
    const { getGuestStatus } = useStore
    const showNotice = ref(true)
    const isGuest = computed(() => getGuestStatus.value)

    const dismissNotice = () => {
      showNotice.value = false
      sessionStorage.setItem('exportNoticeDismissed', 'true')
    }

    onMounted(() => {
      if (sessionStorage.getItem('exportNoticeDismissed') === 'true') {
        showNotice.value = false
      }
    })

    return {
      showNotice,
      isGuest,
      dismissNotice
    }
  }
}
</script>