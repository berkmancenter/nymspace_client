<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Thread Exports Log</h3>

    <div class="bg-gray-50 p-4 rounded-lg">
      <p class="text-sm text-gray-600 mb-4">
        This log shows all instances where threads containing your messages have been exported.
      </p>

      <div v-if="loading" class="text-center py-4">
        <div class="inline-flex items-center">
          <svg
            class="animate-spin h-5 w-5 mr-3 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading audit log...
        </div>
      </div>

      <div v-else-if="error" class="text-red-600 text-sm">Failed to load export audit log. Please try again later.</div>

      <div v-else-if="audits.length === 0" class="text-gray-500 text-sm">
        No exports found. Your messages have not been included in any thread exports yet.
      </div>

      <div v-else>
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thread</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exported By</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="audit in audits" :key="audit._id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.threadName }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {{ audit.exporterUsername }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="audit.format === 'docx' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ audit.format.toUpperCase() }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(audit.exportDate) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {{ audit.messageCount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-3">
          <div v-for="audit in audits" :key="audit._id" class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-medium text-gray-900 text-sm truncate flex-1 mr-2">
                {{ audit.threadName }}
              </h4>
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                :class="audit.format === 'docx' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
              >
                {{ audit.format.toUpperCase() }}
              </span>
            </div>

            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Exported by:</span>
                <span class="text-gray-900 font-medium">{{ audit.exporterUsername }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Date:</span>
                <span class="text-gray-900">{{ formatDate(audit.exportDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Messages:</span>
                <span class="text-gray-900 font-medium">{{ audit.messageCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../../service'

export default {
  name: 'ExportAuditLog',
  setup() {
    const audits = ref([])
    const loading = ref(true)
    const error = ref(false)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const loadAuditLog = async () => {
      loading.value = true
      error.value = false

      try {
        const response = await api.getExportAuditLog()
        audits.value = response.audits || []
      } catch (err) {
        console.error('Failed to load audit log:', err)
        error.value = true
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadAuditLog()
    })

    return {
      audits,
      loading,
      error,
      formatDate
    }
  }
}
</script>
