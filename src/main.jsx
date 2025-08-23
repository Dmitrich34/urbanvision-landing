import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// single → HashRouter (файл с диска), иначе BrowserRouter (Dev/Pages)
const isSingle = import.meta.env.MODE === 'single'
const Router = isSingle ? HashRouter : BrowserRouter

// На Pages путь базовый = import.meta.env.BASE_URL ("/urbanvision-landing/")
const basename = isSingle ? undefined : import.meta.env.BASE_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router basename={basename}>
      <App />
    </Router>
  </StrictMode>,
)
