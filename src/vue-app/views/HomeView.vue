
<template>
  <div class="home">
    <h2 class="text-xl font-semibold mb-4">Home Page</h2>
    <p class="mb-4">This is a Vue 3 application with TypeScript and Tailwind CSS.</p>
    <BaseButton @click="incrementCount">
      Count is: {{ count }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()
const count = ref(0)

function incrementCount() {
  count.value++
  counterStore.increment()
}
</script>
