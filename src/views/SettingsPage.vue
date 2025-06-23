<template>
  <div class="mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-2xl font-bold mb-8">Account Settings</h1>

    <div class="grid gap-8 max-w-4xl">
      <section class="bg-white rounded-lg shadow p-6">
        <PrivacySettings />
      </section>

      <section class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Account Information</h3>
        <div v-if="user">
          <p class="text-sm text-gray-600 mb-2"><strong>Username:</strong> {{ user.username || 'Not set' }}</p>
          <p class="text-sm text-gray-600 mb-2"><strong>Email:</strong> {{ user.email || 'Not set' }}</p>
          <p class="text-sm text-gray-600"><strong>Account created:</strong> {{ formatDate(user.createdAt) }}</p>
        </div>
      </section>

      <section class="bg-white rounded-lg shadow p-6">
        <ExportAuditLog />
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import useStore from '../composables/global/useStore'
import PrivacySettings from '../components/Settings/PrivacySettings.vue'
import ExportAuditLog from '../components/Settings/ExportAuditLog.vue'
import api from '../service'

export default {
  name: 'SettingsPage',
  components: {
    PrivacySettings,
    ExportAuditLog
  },
  setup() {
    const { getId } = useStore
    const user = ref(null)

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown'
      return new Date(dateString).toLocaleDateString()
    }

    onMounted(async () => {
      const userId = getId.value
      if (userId) {
        user.value = await api.getUser(userId)
      }
    })

    return {
      user,
      formatDate
    }
  }
}
</script>
