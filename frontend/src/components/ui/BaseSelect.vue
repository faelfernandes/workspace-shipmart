<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  error?: string
  required?: boolean
}>()
</script>

<template>
  <div class="flex flex-col">
    <label v-if="label" class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500 dark:text-red-400">*</span>
    </label>

    <select :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :required="required"
      class="px-3 py-2 pr-8 rounded-md border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
             border-gray-300 dark:border-gray-600
             transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
             focus:border-blue-500 dark:focus:border-blue-400
             disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
             appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em]"
      :class="error ? 'border-red-500 dark:border-red-400' : ''">
      <slot></slot>
    </select>

    <span v-if="error" class="mt-1 text-sm text-red-500 dark:text-red-400">
      {{ error }}
    </span>
  </div>
</template>
