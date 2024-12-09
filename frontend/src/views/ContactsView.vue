<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useContactStore } from '@/stores/contact'
import ContactList from '@/components/contacts/ContactList.vue'
import ContactFilters from '@/components/contacts/ContactFilters.vue'
import ContactModal from '@/components/contacts/ContactModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import type { Contact } from '@/types/contact'

const store = useContactStore()
const { t } = useI18n()

const showModal = ref(false)
const selectedContact = ref<Contact | undefined>()

const handleNewContact = () => {
  selectedContact.value = undefined
  showModal.value = true
}

const handleEditContact = (contact: Contact) => {
  selectedContact.value = { ...contact }
  showModal.value = true
}

const handleSaveContact = async (data: Contact) => {
  await store.saveContact(data)
  showModal.value = false
}

onMounted(() => {
  store.fetchContacts()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ t('contacts.title') }}
      </h1>
      <BaseButton @click="handleNewContact">
        {{ t('contacts.new') }}
      </BaseButton>
    </div>

    <div class="mb-6">
      <ContactFilters />
    </div>

    <div v-if="store.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="store.error" class="text-red-500">
      {{ store.error }}
    </div>

    <ContactList v-else @edit="handleEditContact" />

    <ContactModal :is-open="showModal" :contact="selectedContact" @close="showModal = false"
      @save="handleSaveContact" />
  </div>
</template>
