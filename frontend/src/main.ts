import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const app = createApp(App)

const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
}

app.use(createPinia().use(createPersistedState()))
app.use(router)
app.use(i18n)
app.use(Toast, options)

app.mount('#app')
