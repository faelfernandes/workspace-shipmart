import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false)

    function init() {
      updateTheme()
    }

    function toggleTheme() {
      isDark.value = !isDark.value
      updateTheme()
    }

    function updateTheme() {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    setTimeout(() => {
      init()
    }, 0)

    return {
      isDark,
      toggleTheme,
    }
  },
  {
    persist: true,
  },
)
