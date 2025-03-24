
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

interface UserSettings {
  userName: string;
  userEmail: string;
  language: string;
  userAvatar?: string;
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("user-settings", {
    userName: "Joselyn Monge",
    userEmail: "joselyn@ejemplo.com",
    language: "es"
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    // Use the functional update pattern to ensure type safety
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return {
    settings,
    updateSettings
  };
}
