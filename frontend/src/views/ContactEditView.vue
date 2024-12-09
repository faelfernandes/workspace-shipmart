<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContactStore } from '@/stores/contact'
import { useI18n } from 'vue-i18n'
import ContactForm from '@/components/contacts/ContactForm.vue'
import type { Contact } from '@/types/contact'

const route = useRoute()
const router = useRouter()
const store = useContactStore()
const { t } = useI18n()
const loading = ref(false)

const isNew = route.params.id === 'new'
const title = isNew ? t('contacts.new') : t('contacts.edit')

const initialData = ref<Contact>({
  name: '',
  email: '',
  phone: '',
  address: {
    neighborhood: '',
    street: '',
    number: '',
    city: '',
    state: '',
    zip_code: ''
  }
})

onMounted(async () => {
  if (!isNew) {
    loading.value = true
    try {
      const contact = await store.fetchContact(Number(route.params.id))
      if (contact) {
        initialData.value = { ...contact }
      }
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async (data: Contact) => {
  try {
    await store.saveContact(data)
    router.push({ name: 'contacts' })
  } catch (error) {
    console.error('Erro ao salvar contato:', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
      {{ title }}
    </h1>
    <ContactForm v-if="!loading" :initial-data="initialData" @submit="handleSubmit" />
    <div v-else class="text-center text-gray-600 dark:text-gray-400">
      {{ t('common.loading') }}
    </div>
  </div>
</template>
