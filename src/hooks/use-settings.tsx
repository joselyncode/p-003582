
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

interface UserSettings {
  userName: string;
  userEmail: string;
  language: string;
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<UserSettings>("user-settings", {
    userName: "Joselyn Monge",
    userEmail: "joselyn@ejemplo.com",
    language: "es"
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    // Ensure we're updating with the latest state
    setSettings((prevSettings: UserSettings) => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return {
    settings,
    updateSettings
  };
}
