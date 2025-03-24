
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useEffect } from 'react'

// Initialize dark mode from local storage if available
const initializeDarkMode = () => {
  const storedSettings = localStorage.getItem('user-settings')
  if (storedSettings) {
    try {
      const settings = JSON.parse(storedSettings)
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (settings.theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          document.documentElement.classList.add('dark')
        }
      }
    } catch (error) {
      console.error('Error parsing user settings:', error)
    }
  }
}

// Run initialization before rendering
initializeDarkMode()

createRoot(document.getElementById("root")!).render(<App />)
