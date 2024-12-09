import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale } = useI18n()

  const savedLocale = localStorage.getItem('language')
  if (savedLocale) {
    locale.value = savedLocale
  }

  watch(locale, (newLocale) => {
    localStorage.setItem('language', newLocale)
  })

  return {
    locale,
  }
}
