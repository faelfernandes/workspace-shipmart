<script setup lang="ts">
import { useContactStore } from '@/stores/contact'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { BRAZILIAN_STATES } from '@/constants/states'

const store = useContactStore()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseInput v-model="store.filters.searchTerm" :label="$t('contacts.filters.search')"
        :placeholder="$t('contacts.filters.searchPlaceholder')" />

      <BaseSelect v-model="store.filters.state" :label="$t('contacts.filters.state')">
        <option value="" class="bg-white dark:bg-gray-700">
          {{ $t('contacts.filters.allStates') }}
        </option>
        <option v-for="state in BRAZILIAN_STATES" :key="state" :value="state" class="bg-white dark:bg-gray-700">
          {{ state }}
        </option>
      </BaseSelect>

      <BaseInput v-model="store.filters.city" :label="$t('contacts.filters.city')"
        :placeholder="$t('contacts.filters.allCities')" />
    </div>
  </div>
</template>
