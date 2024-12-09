import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

interface EmailJob {
  id: number
  queue: string
  attempts: number
  created_at: number
  email_data: {
    to: string
    subject: string
    contact_id: string
  }
}

interface QueueResponse {
  total: number
  jobs: EmailJob[]
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
})

export const useQueueStore = defineStore('queue', () => {
  const jobs = ref<EmailJob[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()
  const { t } = useI18n()

  async function fetchEmailQueue() {
    loading.value = true
    try {
      const { data } = await api.get<QueueResponse>('/queue/emails')
      jobs.value = data.jobs
      total.value = data.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro desconhecido'
      toast.error(t('common.error'))
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    total,
    loading,
    error,
    fetchEmailQueue,
  }
})
