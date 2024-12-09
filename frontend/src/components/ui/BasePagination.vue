<script setup lang="ts">
interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface Props {
  currentPage: number
  lastPage: number
  links: PaginationLink[]
  total: number
  from: number
  to: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const handlePageChange = (url: string | null) => {
  if (!url) return
  
  const pageMatch = url.match(/page=(\d+)/)
  if (pageMatch) {
    emit('page-change', parseInt(pageMatch[1]))
  }
}

const isNumber = (label: string) => !isNaN(Number(label))
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-6 py-3 border-t dark:border-gray-700">
    <!-- Informação sobre os resultados -->
    <div class="text-sm text-gray-700 dark:text-gray-300">
      {{ $t('pagination.showing') }} <span class="font-medium">{{ from }}</span> {{ $t('pagination.to') }}
      <span class="font-medium">{{ to }}</span> {{ $t('pagination.of') }}
      <span class="font-medium">{{ total }}</span> {{ $t('pagination.results') }}
    </div>

    <!-- Botões de paginação -->
    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      <!-- Botão Anterior -->
      <button @click="handlePageChange(links[0].url)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
        <span class="sr-only">{{ $t('pagination.previous') }}</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Números das páginas -->
      <template v-for="(link, index) in links.slice(1, -1)" :key="index">
        <button v-if="isNumber(link.label) || link.label === '...'" @click="handlePageChange(link.url)"
          :disabled="!link.url"
          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600"
          :class="{
            'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600': link.active,
            'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-offset-0': !link.active,
            'cursor-default': link.label === '...'
          }">
          {{ link.label }}
        </button>
      </template>

      <!-- Botão Próximo -->
      <button @click="handlePageChange(links[links.length - 1].url)"
        :disabled="currentPage === lastPage"
        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === lastPage }">
        <span class="sr-only">{{ $t('pagination.next') }}</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </div>
</template> 