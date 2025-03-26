
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Mi Workspace</h2>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-6 flex justify-between items-center">
        <h3 class="text-lg font-medium">Documentos recientes</h3>
        <BaseButton variant="secondary">
          <PlusIcon class="h-4 w-4 mr-1" /> Nuevo documento
        </BaseButton>
      </div>
      
      <div v-if="documents.length" class="divide-y">
        <div v-for="(doc, index) in documents" :key="index" class="py-3 flex items-center">
          <component :is="doc.icon" class="h-5 w-5 text-gray-500 mr-3" />
          <div class="flex-1">
            <p class="font-medium">{{ doc.title }}</p>
            <p class="text-sm text-gray-500">{{ doc.lastEdited }}</p>
          </div>
          <div class="space-x-2">
            <button class="text-gray-400 hover:text-gray-600">
              <Pencil class="h-4 w-4" />
            </button>
            <button class="text-gray-400 hover:text-gray-600">
              <Share2 class="h-4 w-4" />
            </button>
            <button class="text-gray-400 hover:text-red-600">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 text-center py-8">No hay documentos disponibles</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import { FileText, FileImage, FileSpreadsheet, PlusIcon, Pencil, Share2, Trash2 } from 'lucide-vue-next';

const documents = ref([
  {
    title: 'Informe trimestral',
    lastEdited: 'Editado hace 2 días',
    icon: FileText
  },
  {
    title: 'Presentación de proyecto',
    lastEdited: 'Editado hace 1 semana',
    icon: FileImage
  },
  {
    title: 'Datos analíticos 2023',
    lastEdited: 'Editado hace 3 semanas',
    icon: FileSpreadsheet
  }
]);
</script>
