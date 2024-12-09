<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchAddressByCep } from '@/services/viaCep'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { BRAZILIAN_STATES } from '@/constants/states'
import type { Contact } from '@/types/contact'

const props = defineProps<{
  initialData: Contact
}>()

const emit = defineEmits<{
  (e: 'submit', data: Contact): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()
const formData = ref<Contact>({ ...props.initialData })
type ErrorKeys = keyof Contact | keyof Contact['address']
const errors = ref<Partial<Record<ErrorKeys, string>>>({})
const loading = ref(false)

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.name.trim()) {
    errors.value.name = t('contacts.validation.required', { field: t('contacts.form.name') })
    isValid = false
  }

  if (!formData.value.email.trim()) {
    errors.value.email = t('contacts.validation.required', { field: t('contacts.form.email') })
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = t('contacts.validation.invalidEmail')
    isValid = false
  }

  if (!formData.value.phone.trim()) {
    errors.value.phone = t('contacts.validation.required', { field: t('contacts.form.phone') })
    isValid = false
  }

  if (!formData.value.address.zip_code.trim()) {
    errors.value.zip_code = t('contacts.validation.required', { field: t('contacts.form.zipCode') })
    isValid = false
  }

  if (!formData.value.address.state) {
    errors.value.state = t('contacts.validation.required', { field: t('contacts.form.state') })
    isValid = false
  }

  if (!formData.value.address.city.trim()) {
    errors.value.city = t('contacts.validation.required', { field: t('contacts.form.city') })
    isValid = false
  }

  if (!formData.value.address.neighborhood.trim()) {
    errors.value.neighborhood = t('contacts.validation.required', { field: t('contacts.form.neighborhood') })
    isValid = false
  }

  if (!formData.value.address.street.trim()) {
    errors.value.street = t('contacts.validation.required', { field: t('contacts.form.address') })
    isValid = false
  }

  if (!formData.value.address.number.trim()) {
    errors.value.number = t('contacts.validation.required', { field: t('contacts.form.number') })
    isValid = false
  }

  return isValid
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  emit('submit', formData.value)
}

const handleCepBlur = async () => {
  const cep = formData.value.address.zip_code?.replace(/\D/g, '')
  if (!cep || cep.length !== 8) {
    errors.value.zip_code = t('contacts.validation.invalidZipCode')
    return
  }

  loading.value = true
  errors.value.zip_code = ''

  try {
    const address = await fetchAddressByCep(cep)
    if (address) {
      formData.value.address = {
        ...formData.value.address,
        state: address.uf,
        city: address.localidade,
        neighborhood: address.bairro,
        street: address.logradouro,
        zip_code: cep
      }
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    errors.value.zip_code = t('contacts.validation.zipCodeNotFound')
  } finally {
    loading.value = false
  }
}

watch(() => formData.value.phone, (newValue) => {
  formData.value.phone = newValue
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
    .slice(0, 15)
})

watch(() => formData.value.address.zip_code, (newValue) => {
  if (!newValue) return

  let value = newValue.replace(/\D/g, '')
  if (value.length > 8) value = value.slice(0, 8)

  if (value.length >= 5) {
    value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2')
  }

  formData.value.address.zip_code = value
})

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit="handleSubmit" class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput v-model="formData.name" :label="$t('contacts.form.name')" :error="errors.name" />

      <BaseInput v-model="formData.email" :label="$t('contacts.form.email')" type="email" :error="errors.email" />

      <BaseInput v-model="formData.phone" :maxlength="15" :label="$t('contacts.form.phone')" :error="errors.phone" />

      <BaseInput v-model="formData.address.zip_code" :label="$t('contacts.form.zipCode')" :error="errors.zip_code"
        @blur="handleCepBlur" :maxlength="9" placeholder="12345-678" />

      <BaseSelect v-model="formData.address.state" :label="$t('contacts.form.state')" :error="errors.state">
        <option value="">{{ $t('contacts.form.selectState') }}</option>
        <option v-for="state in BRAZILIAN_STATES" :key="state" :value="state">
          {{ state }}
        </option>
      </BaseSelect>

      <BaseInput v-model="formData.address.city" :label="$t('contacts.form.city')" :error="errors.city" />

      <BaseInput v-model="formData.address.neighborhood" :label="$t('contacts.form.neighborhood')"
        :error="errors.neighborhood" />

      <BaseInput v-model="formData.address.street" :label="$t('contacts.form.address')" :error="errors.street" />

      <BaseInput v-model="formData.address.number" :label="$t('contacts.form.number')" :error="errors.number" />
    </div>

    <div class="flex justify-end space-x-4">
      <BaseButton type="button" variant="secondary" @click="handleCancel">
        {{ $t('contacts.form.cancel') }}
      </BaseButton>

      <BaseButton type="submit" :loading="loading">
        {{ $t('contacts.form.save') }}
      </BaseButton>
    </div>
  </form>
</template>
