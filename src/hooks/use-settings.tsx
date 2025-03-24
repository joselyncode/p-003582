
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

interface UserSettings {
  userName: string;
  userEmail: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  userAvatar?: string;
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("user-settings", {
    userName: "Joselyn Monge",
    userEmail: "joselyn@ejemplo.com",
    language: "es",
    theme: "light"
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    // Use the functional update pattern to ensure type safety
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  // Función para aplicar el tema actual al documento
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    // Si el tema es 'system', detectar la preferencia del sistema
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      // Aplicar directamente dark o light
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  // Aplicar el tema cuando cambie la configuración
  useEffect(() => {
    applyTheme(settings.theme);
    
    // Añadir listener para cambios en preferencia del sistema si el tema es 'system'
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  return {
    settings,
    updateSettings
  };
}
