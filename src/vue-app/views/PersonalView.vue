
<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-6">Espacio Personal</h2>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div class="flex items-center mb-6">
          <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <User class="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 class="text-xl font-medium">{{ settings.userName }}</h3>
            <p class="text-gray-500">{{ settings.userEmail }}</p>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-medium mb-3">Información personal</h4>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" id="name" v-model="profile.name"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" v-model="profile.email"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
              <textarea id="bio" v-model="profile.bio" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div class="flex justify-end">
              <BaseButton type="submit">Guardar cambios</BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User } from 'lucide-vue-next';
import BaseButton from '../components/BaseButton.vue';
import { useSettings } from '../composables/useSettings';
import { useToast } from '../composables/useToast';

const { settings, updateSettings } = useSettings();
const { toast } = useToast();

const profile = ref({
  name: '',
  email: '',
  bio: ''
});

onMounted(() => {
  // Inicializar con datos existentes
  profile.value.name = settings.userName;
  profile.value.email = settings.userEmail;
  profile.value.bio = '';
});

const saveProfile = () => {
  // Actualizar configuración
  updateSettings({
    userName: profile.value.name,
    userEmail: profile.value.email
  });
  
  toast('Éxito', 'Perfil actualizado correctamente', 'success');
};
</script>
