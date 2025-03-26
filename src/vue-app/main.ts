
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './tailwind.css'
import * as lucide from 'lucide-vue-next'

// Create the Vue app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router
app.use(router)

// Register all Lucide icons
for (const [key, icon] of Object.entries(lucide)) {
  if (key !== 'createLucideIcon' && key !== 'defaultAttributes') {
    app.component(key, icon)
  }
}

// Mount the app
app.mount('#vue-app')
