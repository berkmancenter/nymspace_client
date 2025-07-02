<template>
  <div v-if="getEnableExportOptOut">
    <div class="flex items-start justify-between mb-4">
      <h3 class="text-xl font-semibold mb-4">Data Export Settings</h3>
      <div v-if="saving" class="text-sm text-gray-500">Saving...</div>
      <div v-if="saved" class="text-sm text-green-600">✓ Settings saved</div>
      <div v-if="error" class="text-sm text-red-600">Error saving settings. Please try again.</div>
    </div>

    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="mb-4">
        <label class="flex items-start cursor-pointer">
          <input
            v-model="dataExportOptOut"
            type="checkbox"
            class="w-4 h-4 mt-1.5 mx-2 align-middle cursor-pointer"
            @change="updatePreference"
          />
          <div class="ml-3">
            <span class="text-sm font-medium text-gray-700">Exclude my messages from data exports</span>
            <p class="text-sm text-gray-500 mt-1">
              When checked, your messages will be excluded from all thread exports. Thread owners can export their threads,
              but your messages won't be included. This only affects future exports.
            </p>
          </div>
        </label>
      </div>
    </div>

    <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
      <p class="text-sm text-gray-700">
        <strong>Note:</strong> This setting only affects future exports. Past exports have already been downloaded. Thread
        owners can export their own threads. When enabled, your messages will be excluded from all exports.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../../service'
import useStore from '../../composables/global/useStore'

export default {
  name: 'PrivacySettings',
  setup() {
    const { getId, getEnableExportOptOut } = useStore
    const dataExportOptOut = ref(false)
    const saving = ref(false)
    const saved = ref(false)
    const error = ref(false)

    api.getUserId = () => getId.value

    const loadPreference = async () => {
      try {
        const response = await api.getDataExportPreference()
        dataExportOptOut.value = response.dataExportOptOut
      } catch (err) {
        console.error('Failed to load preference:', err)
      }
    }

    const updatePreference = async () => {
      saving.value = true
      saved.value = false
      error.value = false

      try {
        await api.updateDataExportPreference(dataExportOptOut.value)
        saved.value = true
        setTimeout(() => {
          saved.value = false
        }, 3000)
      } catch (err) {
        console.error('Failed to update preference:', err)
        error.value = true
        dataExportOptOut.value = !dataExportOptOut.value
      } finally {
        saving.value = false
      }
    }

    onMounted(() => {
      loadPreference()
    })

    return {
      dataExportOptOut,
      saving,
      saved,
      error,
      updatePreference,
      getEnableExportOptOut
    }
  }
}
</script>
