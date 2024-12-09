<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { t } = useI18n()
const themeStore = useThemeStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side - Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/">
              <img class="h-12 w-auto transition-filter duration-200" :class="{ 'invert': themeStore.isDark }"
                src="@/assets/logo.png" alt="Logo" />
            </router-link>
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:flex md:items-center md:space-x-8">
            <router-link to="/contacts"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path.includes('contacts') }">
              {{ t('navigation.contacts') }}
            </router-link>

            <router-link to="/queue/emails"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path.includes('queue/emails') }">
              {{ t('navigation.queues') }}
            </router-link>

            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden">
            <button @click="toggleMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span class="sr-only">Open main menu</span>
              <!-- Menu open icon -->
              <svg v-if="!isMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <!-- Menu close icon -->
              <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isMenuOpen" class="md:hidden border-b border-gray-200 dark:border-gray-700">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/contacts" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300
                   hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400': $route.path.includes('contacts') }"
            @click="isMenuOpen = false">
            {{ t('navigation.contacts') }}
          </router-link>

          <router-link to="/queue/emails" class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300
                   hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400': $route.path.includes('queue/emails') }"
            @click="isMenuOpen = false">
            {{ t('navigation.queues') }}
          </router-link>

          <div class="px-3 py-2">
            <div class="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.invert {
  filter: invert(1);
}
</style>
