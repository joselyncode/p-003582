
import { ref } from 'vue';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastItem {
  id: number;
  title: string;
  message: string;
  type: ToastType;
}

// Singleton para asegurar que solo haya una instancia del sistema de toast
const toasts = ref<ToastItem[]>([]);
let nextId = 1;

export function useToast() {
  const toast = (title: string, message: string, type: ToastType = 'info') => {
    const id = nextId++;
    toasts.value.push({ id, title, message, type });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };
  
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return { toast, toasts, removeToast };
}
