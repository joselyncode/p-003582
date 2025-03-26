
import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const value = ref<T>(readValue());

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (newValue: T) => {
    try {
      // Save state
      value.value = newValue;
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this local storage key in other tabs/windows
  watch(value, (newValue) => {
    window.localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return { value, setValue };
}
