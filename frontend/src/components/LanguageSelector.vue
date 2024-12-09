<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const { locale } = useI18n()

const languages = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
]
</script>

<template>
  <BaseSelect v-model="locale"
    class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
    <option v-for="lang in languages" :key="lang.code" :value="lang.code">
      {{ lang.name }}
    </option>
  </BaseSelect>
</template>
