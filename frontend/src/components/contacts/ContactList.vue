<script setup lang="ts">
import { useContactStore } from '@/stores/contact'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import type { Contact } from '@/types/contact'
import BasePagination from '@/components/ui/BasePagination.vue'

const store = useContactStore()
const { t } = useI18n()
const selectedContacts = ref<number[]>([])
const showDeleteModal = ref(false)
const contactToDelete = ref<number | null>(null)

const emit = defineEmits<{
  (e: 'edit', contact: Contact): void
}>()

const handleEdit = (contact: Contact) => {
  emit('edit', contact)
}

const handleDelete = (id: number) => {
  contactToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (contactToDelete.value) {
    await store.deleteContact(contactToDelete.value)
    showDeleteModal.value = false
    contactToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  contactToDelete.value = null
}

const handleExportSelected = async () => {
  if (selectedContacts.value.length === 0) {
    alert(t('contacts.list.noContactsSelected'))
    return
  }
  await store.exportSelectedContacts(selectedContacts.value)
}

const handleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedContacts.value = target.checked ? store.contacts.map(c => c.id!).filter(Boolean) : []
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
    <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('contacts.list.total', { total: store.pagination.total }) }}
      </div>
      <button @click="handleExportSelected"
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        :disabled="selectedContacts.length === 0">
        {{ t('contacts.list.export') }}
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <input type="checkbox" @change="handleSelectAll"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500"
                :checked="selectedContacts.length === store.contacts.length">
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('contacts.list.name') }}
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('contacts.list.email') }}
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('contacts.list.phone') }}
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('contacts.list.location') }}
            </th>
            <th scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('contacts.list.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="contact in store.contacts" :key="contact.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="checkbox" v-model="selectedContacts" :value="contact.id"
                class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
              {{ contact.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
              {{ contact.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
              {{ formatPhone(contact.phone) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
              {{ contact.address.city }}/{{ contact.address.state }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="handleEdit(contact)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                {{ t('contacts.list.edit') }}
              </button>
              <button @click="handleDelete(contact.id!)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                {{ t('contacts.list.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationModal :is-open="showDeleteModal" :title="t('contacts.list.delete')"
      :message="t('contacts.list.confirmDelete')" @confirm="confirmDelete" @cancel="cancelDelete" />

    <BasePagination v-if="store.contacts.length" :current-page="store.pagination.currentPage"
      :last-page="store.pagination.totalPages" :total="store.pagination.total" :from="store.pagination.from"
      :to="store.pagination.to" :links="store.pagination.links" @page-change="store.handlePageChange" />
  </div>
</template>
