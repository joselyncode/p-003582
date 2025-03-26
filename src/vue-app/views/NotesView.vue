
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Mis Notas</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-medium">Notas recientes</h3>
          <button class="text-blue-600 hover:text-blue-800 text-sm">Ver todas</button>
        </div>
        
        <div v-if="recentNotes.length" class="space-y-4">
          <div v-for="(note, index) in recentNotes" :key="index" 
               class="border p-3 rounded hover:bg-gray-50 cursor-pointer">
            <h4 class="font-medium">{{ note.title }}</h4>
            <p class="text-sm text-gray-500 mb-2">{{ note.date }}</p>
            <p class="text-sm text-gray-700 line-clamp-2">{{ note.preview }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-4">No hay notas recientes</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Crear nueva nota</h3>
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" id="title" v-model="newNote.title"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea id="content" v-model="newNote.content" rows="5"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <BaseButton @click="saveNote">Guardar nota</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import { useToast } from '../composables/useToast';

const { toast } = useToast();

const recentNotes = ref([
  {
    title: 'Ideas para el proyecto',
    date: '15 mayo, 2023',
    preview: 'Implementar nuevas funcionalidades para mejorar la experiencia del usuario...'
  },
  {
    title: 'Reunión con el equipo',
    date: '10 mayo, 2023',
    preview: 'Puntos a tratar: calendario de lanzamiento, asignación de tareas, presupuesto...'
  },
  {
    title: 'Recordatorios',
    date: '5 mayo, 2023',
    preview: 'Llamar al cliente, enviar propuesta, actualizar documentación...'
  }
]);

const newNote = ref({
  title: '',
  content: ''
});

const saveNote = () => {
  if (!newNote.value.title || !newNote.value.content) {
    toast('Error', 'Por favor completa todos los campos', 'error');
    return;
  }
  
  // Aquí iría la lógica para guardar la nota
  toast('Éxito', 'Nota guardada correctamente', 'success');
  
  // Simular que se añade a las notas recientes
  recentNotes.value.unshift({
    title: newNote.value.title,
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    preview: newNote.value.content.substring(0, 100) + '...'
  });
  
  // Limpiar el formulario
  newNote.value = { title: '', content: '' };
};
</script>
