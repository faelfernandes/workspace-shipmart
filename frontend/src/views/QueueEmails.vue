<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ t('queue.emails.title') }}
      </h1>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="text-red-500 dark:text-red-400">
      {{ error }}
    </div>

    <template v-else>
      <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div class="p-4 border-b dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('queue.emails.totalJobs', { total }) }}
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('queue.emails.queue') }}
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('queue.emails.attempts') }}
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('queue.emails.createdAt') }}
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('queue.emails.to') }}
                </th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('queue.emails.subject') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {{ job.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {{ job.queue }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {{ job.attempts }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {{ formatDate(job.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {{ job.email_data.to }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {{ job.email_data.subject }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQueueStore } from '@/stores/queue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const queueStore = useQueueStore()
const { jobs, total, loading, error } = storeToRefs(queueStore)
const { t } = useI18n()

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString()
}

onMounted(() => {
  queueStore.fetchEmailQueue()
})
</script>

<style scoped>
.queue-emails {
  padding: 20px;
}

.queue-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.queue-table th,
.queue-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.queue-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.queue-summary {
  margin: 20px 0;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
}
</style>
