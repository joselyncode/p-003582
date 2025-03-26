
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './tailwind.css'
import * as icons from 'lucide-vue-next'

// Create the Vue app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router
app.use(router)

// Register specific Lucide icons that we need
// This avoids type errors by explicitly casting each icon component
const iconComponents = {
  Home: icons.Home,
  Settings: icons.Settings,
  User: icons.User,
  FileText: icons.FileText,
  Folder: icons.Folder,
  NotebookPen: icons.NotebookPen,
  CheckSquare: icons.CheckSquare,
  Clock: icons.Clock,
  Pencil: icons.Pencil,
  Share2: icons.Share2,
  Trash2: icons.Trash2,
  PlusIcon: icons.PlusIcon,
  FileImage: icons.FileImage,
  FileSpreadsheet: icons.FileSpreadsheet
};

// Register each icon component
Object.entries(iconComponents).forEach(([name, component]) => {
  app.component(name, component);
});

// Mount the app
app.mount('#vue-app')
