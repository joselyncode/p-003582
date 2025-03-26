
<template>
  <div class="about">
    <h2 class="text-xl font-semibold mb-4">About Page</h2>
    <p>This is the about page of our Vue 3 application.</p>
    <p class="mt-2">Store count: {{ counterStore.count }}</p>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()
</script>
