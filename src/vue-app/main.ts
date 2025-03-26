
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './tailwind.css'
import { plugin as LucideVue } from 'lucide-vue-next'

// Create the Vue app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router
app.use(router)

// Use Lucide Vue icons
app.use(LucideVue)

// Mount the app
app.mount('#vue-app')
