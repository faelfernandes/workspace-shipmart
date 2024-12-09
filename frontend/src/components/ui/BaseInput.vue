<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  error?: string
  type?: string
  required?: boolean
  placeholder?: string
  maxlength?: number
}>()
</script>

<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500 dark:text-red-400">*</span>
    </label>

    <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)" :type="type || 'text'" :required="required" :placeholder="placeholder"
      :maxlength="maxlength" class="px-3 py-2 rounded-md border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
             border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500
             transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
             focus:border-blue-500 dark:focus:border-blue-400"
      :class="error ? 'border-red-500 dark:border-red-400' : ''">

    <span v-if="error" class="mt-1 text-sm text-red-500 dark:text-red-400">
      {{ error }}
    </span>
  </div>
</template>
