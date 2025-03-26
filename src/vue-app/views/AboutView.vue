
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Acerca de Mi Workspace</h2>
    
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <p class="mb-4">Esta es una aplicación de gestión de espacios de trabajo desarrollada con Vue 3, TypeScript y Tailwind CSS.</p>
      <p class="mb-4">Con esta aplicación puedes:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li>Organizar tus documentos y notas</li>
        <li>Gestionar tus tareas pendientes</li>
        <li>Crear espacios de trabajo colaborativos</li>
        <li>Personalizar tu experiencia</li>
      </ul>
      
      <div class="mt-6 pt-4 border-t">
        <h3 class="text-lg font-medium mb-2">Estado del contador de Pinia</h3>
        <p>Contador actual: {{ counterStore.count }}</p>
        <div class="flex space-x-2 mt-2">
          <BaseButton @click="counterStore.increment">Incrementar</BaseButton>
          <BaseButton variant="secondary" @click="counterStore.decrement">Decrementar</BaseButton>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">Información del sistema</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Versión</p>
          <p>1.0.0</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Framework</p>
          <p>Vue 3 con TypeScript</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">CSS</p>
          <p>Tailwind CSS</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Estado</p>
          <p>Pinia</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '../stores/counter';
import BaseButton from '../components/BaseButton.vue';

const counterStore = useCounterStore();
</script>
