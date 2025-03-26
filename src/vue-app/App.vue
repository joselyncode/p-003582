
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="py-4 px-6 bg-white border-b shadow-sm">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Mi Workspace</h1>
        <nav class="hidden md:flex space-x-4">
          <router-link to="/vue" class="px-3 py-2 text-gray-700 hover:text-blue-600">Inicio</router-link>
          <router-link to="/vue/workspace" class="px-3 py-2 text-gray-700 hover:text-blue-600">Workspace</router-link>
          <router-link to="/vue/notes" class="px-3 py-2 text-gray-700 hover:text-blue-600">Notas</router-link>
          <router-link to="/vue/personal" class="px-3 py-2 text-gray-700 hover:text-blue-600">Personal</router-link>
          <router-link to="/vue/todos" class="px-3 py-2 text-gray-700 hover:text-blue-600">Tareas</router-link>
          <router-link to="/vue/about" class="px-3 py-2 text-gray-700 hover:text-blue-600">Acerca de</router-link>
        </nav>
        <div class="flex md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 space-y-2">
        <router-link to="/vue" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Inicio</router-link>
        <router-link to="/vue/workspace" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Workspace</router-link>
        <router-link to="/vue/notes" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Notas</router-link>
        <router-link to="/vue/personal" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Personal</router-link>
        <router-link to="/vue/todos" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Tareas</router-link>
        <router-link to="/vue/about" class="block px-3 py-2 text-gray-700 hover:text-blue-600">Acerca de</router-link>
      </div>
    </header>
    
    <main class="flex-1 p-6">
      <router-view></router-view>
    </main>
    
    <footer class="py-4 px-6 bg-white border-t text-center text-gray-500 text-sm">
      <p>© {{ new Date().getFullYear() }} Mi Workspace. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSettings } from './composables/useSettings';

const mobileMenuOpen = ref(false);
const { settings } = useSettings();

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>
