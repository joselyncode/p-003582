
<template>
  <div class="flex flex-col items-center justify-center py-12">
    <h2 class="text-6xl font-bold text-gray-800 mb-4">404</h2>
    <p class="text-xl text-gray-600 mb-8">Página no encontrada</p>
    <p class="text-gray-500 mb-8 text-center max-w-md">
      Lo sentimos, la página que estás buscando no existe o ha sido movida.
    </p>
    <router-link to="/vue" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
      Volver al inicio
    </router-link>
  </div>
</template>
