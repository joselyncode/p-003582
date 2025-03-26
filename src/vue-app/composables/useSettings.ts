
import { ref, reactive, watchEffect } from 'vue';
import { useLocalStorage } from './useLocalStorage';

interface UserSettings {
  userName: string;
  userEmail: string;
  language: string;
  userAvatar?: string;
}

export function useSettings() {
  const defaultSettings: UserSettings = {
    userName: "Joselyn Monge",
    userEmail: "joselyn@ejemplo.com",
    language: "es"
  };

  const { value: storedSettings, setValue: setStoredSettings } = useLocalStorage<UserSettings>("user-settings", defaultSettings);
  
  const settings = reactive<UserSettings>({...storedSettings.value});
  
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    Object.assign(settings, newSettings);
    setStoredSettings({...settings});
  };

  return {
    settings,
    updateSettings
  };
}
