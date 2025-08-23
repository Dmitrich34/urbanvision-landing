import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// В режиме "single" (pnpm build:single) используем HashRouter,
// чтобы файл index.html открывался напрямую (file://) без сервера.
const Router = import.meta.env.MODE === 'single' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
