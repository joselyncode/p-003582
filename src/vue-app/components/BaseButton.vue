
<template>
  <button
    :class="[
      'px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' :
      variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400' :
      variant === 'success' ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500' :
      variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' :
      'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300'
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'default'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>
