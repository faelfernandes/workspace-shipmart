<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ContactForm from './ContactForm.vue'
import type { Contact } from '@/types/contact'

const props = defineProps<{
  isOpen: boolean
  contact?: Contact
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'save', data: Contact): void
}>()

const { t } = useI18n()

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
  },
  ...props.contact
})

watch(() => props.contact, (newContact) => {
  if (newContact) {
    initialData.value = { ...newContact }
  } else {
    initialData.value = {
      address: {
        zip_code: '',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        number: '',
      },
      name: '',
      email: '',
      phone: ''
    }
  }
}, { immediate: true })

const title = props.contact?.id ? t('contacts.edit') : t('contacts.new')
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Overlay escuro -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-4xl">
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
            <!-- Header -->
            <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <button @click="$emit('close')"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                <span class="sr-only">Fechar</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="px-6 py-4">
              <ContactForm :initial-data="initialData" @submit="(data) => $emit('save', data)"
                @cancel="$emit('close')" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
