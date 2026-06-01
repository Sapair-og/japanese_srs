import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Automatically refresh the page when a new version of the app is detected
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New version detected, auto-refreshing page...");
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App ready for offline use.");
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
