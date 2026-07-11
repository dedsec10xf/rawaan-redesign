import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted variable fonts (font-display: swap built in)
import '@fontsource-variable/fraunces'
import '@fontsource-variable/archivo'
// Decorative footer watermark only — weight 400, font-display: swap, no preload
import '@fontsource/noto-nastaliq-urdu/400.css'
import './styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
