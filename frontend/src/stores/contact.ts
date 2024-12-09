import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Contact, ContactFilters } from '@/types/contact'
import { ContactService } from '@/services/api/contact'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export const useContactStore = defineStore('contact', () => {
  const contacts = ref<Contact[]>([])
  const filters = ref<ContactFilters>({
    searchTerm: '',
    state: '',
    city: '',
    page: 1,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    from: 0,
    to: 0,
    links: [] as Array<{
      url: string | null
      label: string
      active: boolean
    }>,
  })
  const router = useRouter()
  const { t } = useI18n()

  const uniqueCities = computed(() => {
    const cities = contacts.value
      .filter((contact) => contact.address.state === filters.value.state)
      .map((contact) => contact.address.city)
    return Array.from(new Set(cities)).sort()
  })

  async function fetchContacts() {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        page: filters.value.page.toString(),
        per_page: '15',
      })

      if (filters.value.searchTerm) {
        params.append('search', filters.value.searchTerm)
      }

      if (filters.value.state) {
        params.append('state', filters.value.state)
      }

      if (filters.value.city) {
        params.append('city', filters.value.city)
      }

      const response = await ContactService.getAll(params)
      contacts.value = response.data
      pagination.value.currentPage = response.current_page
      pagination.value.totalPages = response.last_page
      pagination.value.total = response.total
      pagination.value.from = response.from
      pagination.value.to = response.to
      pagination.value.links = response.links
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      toast.error(t('common.error'))
      contacts.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchContact(id: number) {
    try {
      return await ContactService.getById(id)
    } catch (e) {
      toast.error(t('contacts.messages.loadError'))
      throw e
    }
  }

  async function deleteContact(id: number) {
    try {
      await ContactService.delete(id)
      await fetchContacts()
      toast.success(t('contacts.messages.deleteSuccess'))
    } catch (e) {
      toast.error(t('contacts.messages.deleteError'))
      throw e
    }
  }

  async function exportSelectedContacts(ids: number[]) {
    try {
      const blob = await ContactService.exportToCsv(ids)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contacts.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success(t('contacts.messages.exportSuccess'))
    } catch (e) {
      toast.error(t('contacts.messages.exportError'))
      throw e
    }
  }

  async function saveContact(contact: Contact) {
    loading.value = true
    error.value = null

    try {
      if (contact.id) {
        await ContactService.update(contact.id, contact)
        const index = contacts.value.findIndex((c) => c.id === contact.id)
        if (index !== -1) {
          contacts.value[index] = contact
        }
        toast.success(t('contacts.messages.updateSuccess'))
      } else {
        const newContact = await ContactService.create(contact)
        contacts.value.push(newContact)
        toast.success(t('contacts.messages.createSuccess'))
      }
      router.push({ name: 'contacts' })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      toast.error(t('contacts.messages.saveError'))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = async (page: number) => {
    filters.value.page = page
    await fetchContacts()
  }

  watch(
    () => [filters.value.searchTerm, filters.value.state, filters.value.city],
    () => {
      filters.value.page = 1
      fetchContacts()
    },
    { deep: true },
  )

  return {
    contacts,
    filters,
    loading,
    error,
    pagination,
    uniqueCities,
    fetchContacts,
    fetchContact,
    deleteContact,
    saveContact,
    exportSelectedContacts,
    handlePageChange,
  }
})
