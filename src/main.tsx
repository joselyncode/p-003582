
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the application
const init = async () => {
  // Create root and render the app
  createRoot(document.getElementById("root")!).render(<App />)
}

// Start the application
init()
