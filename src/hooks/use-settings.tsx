
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
    // The issue is here - we need to pass a value directly when using a callback, not return a value
    setSettings({
      ...settings,
      ...newSettings
    });
  };

  return {
    settings,
    updateSettings
  };
}
