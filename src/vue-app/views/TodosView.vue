
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Mis Tareas</h2>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Lista de tareas</h3>
        <div class="flex space-x-2">
          <select v-model="filter" class="px-3 py-1 border border-gray-300 rounded-md text-sm">
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
          <BaseButton variant="secondary" size="sm" @click="clearCompleted">
            Limpiar completadas
          </BaseButton>
        </div>
      </div>
      
      <div class="mb-6">
        <div class="flex">
          <input type="text" v-model="newTask" placeholder="Añadir nueva tarea..."
                 @keyup.enter="addTask"
                 class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          <BaseButton @click="addTask" class="rounded-l-none">Añadir</BaseButton>
        </div>
      </div>
      
      <div v-if="filteredTasks.length" class="space-y-2">
        <div v-for="task in filteredTasks" :key="task.id" 
             class="flex items-center p-3 border rounded hover:bg-gray-50">
          <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)"
                 class="h-4 w-4 text-blue-600 rounded" />
          <span class="ml-3 flex-1" :class="{'line-through text-gray-400': task.completed}">
            {{ task.text }}
          </span>
          <button @click="removeTask(task.id)" class="text-gray-400 hover:text-red-600">
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
      <p v-else class="text-gray-500 text-center py-4">No hay tareas para mostrar</p>
      
      <div class="mt-4 flex justify-between text-sm text-gray-500">
        <span>{{ pendingCount }} pendientes</span>
        <span>{{ completedCount }} completadas</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import BaseButton from '../components/BaseButton.vue';
import { useToast } from '../composables/useToast';

const { toast } = useToast();

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const tasks = ref<Task[]>([
  { id: 1, text: 'Revisar documentación', completed: false },
  { id: 2, text: 'Preparar reunión semanal', completed: false },
  { id: 3, text: 'Actualizar roadmap', completed: true }
]);

const filter = ref('all');
const newTask = ref('');
let nextId = 4;

const filteredTasks = computed(() => {
  if (filter.value === 'all') return tasks.value;
  if (filter.value === 'pending') return tasks.value.filter(task => !task.completed);
  if (filter.value === 'completed') return tasks.value.filter(task => task.completed);
  return tasks.value;
});

const pendingCount = computed(() => tasks.value.filter(task => !task.completed).length);
const completedCount = computed(() => tasks.value.filter(task => task.completed).length);

const addTask = () => {
  if (!newTask.value.trim()) return;
  
  tasks.value.push({
    id: nextId++,
    text: newTask.value.trim(),
    completed: false
  });
  
  newTask.value = '';
  toast('Tarea añadida', 'Se ha añadido una nueva tarea', 'success');
};

const toggleTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
  }
};

const removeTask = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id);
  toast('Tarea eliminada', 'La tarea ha sido eliminada', 'info');
};

const clearCompleted = () => {
  tasks.value = tasks.value.filter(t => !t.completed);
  toast('Tareas completadas eliminadas', 'Se han eliminado todas las tareas completadas', 'info');
};
</script>
