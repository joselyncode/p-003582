
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Inicio</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="(item, index) in workspaceItems" :key="index" 
           class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <router-link :to="item.path" class="block">
          <div class="flex items-center mb-4">
            <component :is="item.icon" class="h-5 w-5 text-blue-500 mr-2" />
            <h3 class="text-lg font-medium">{{ item.title }}</h3>
          </div>
          <p class="text-gray-600">{{ item.description }}</p>
        </router-link>
      </div>
    </div>
    
    <div class="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">Actividad reciente</h3>
      <div v-if="recentActivity.length" class="space-y-4">
        <div v-for="(activity, index) in recentActivity" :key="index" class="flex items-start">
          <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            <component :is="activity.icon" class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="font-medium">{{ activity.title }}</p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No hay actividad reciente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileText, Home, Settings, Folder, NotebookPen, User, CheckSquare, Clock } from 'lucide-vue-next';

// Datos de ejemplo
const workspaceItems = ref([
  { 
    title: 'Workspace', 
    description: 'Accede a tu espacio de trabajo principal', 
    path: '/vue/workspace',
    icon: Folder
  },
  { 
    title: 'Notas', 
    description: 'Gestiona tus notas y apuntes', 
    path: '/vue/notes',
    icon: NotebookPen
  },
  { 
    title: 'Personal', 
    description: 'Tu espacio personal', 
    path: '/vue/personal',
    icon: User
  },
  { 
    title: 'Tareas', 
    description: 'Gestiona tus tareas pendientes', 
    path: '/vue/todos',
    icon: CheckSquare
  }
]);

const recentActivity = ref([
  { 
    title: 'Documento actualizado: Proyecto Marketing', 
    time: 'Hace 2 horas',
    icon: FileText
  },
  { 
    title: 'Nueva nota creada: Ideas de producto', 
    time: 'Ayer',
    icon: NotebookPen
  },
  { 
    title: 'Tarea completada: Presentación trimestral', 
    time: '2 días atrás',
    icon: CheckSquare
  }
]);
</script>
