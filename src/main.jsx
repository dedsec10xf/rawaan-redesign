import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Self-hosted variable fonts (font-display: swap built in)
import '@fontsource-variable/fraunces'
import '@fontsource-variable/archivo'
import './styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
