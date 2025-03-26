
<template>
  <button 
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineEmits(['click'])
</script>
