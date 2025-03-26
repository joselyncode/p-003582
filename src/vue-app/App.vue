
<template>
  <div class="vue-app-container">
    <header class="py-4 px-6 bg-white border-b">
      <h1 class="text-2xl font-bold">Vue 3 App</h1>
      <nav class="mt-2">
        <router-link to="/vue" class="mr-4 text-blue-500 hover:text-blue-700">Home</router-link>
        <router-link to="/vue/about" class="text-blue-500 hover:text-blue-700">About</router-link>
      </nav>
    </header>
    
    <main class="p-6">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// App setup logic here
</script>
