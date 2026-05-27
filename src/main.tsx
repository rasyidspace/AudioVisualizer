import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import OverlayMode from './components/OverlayMode.tsx'

const isOverlay = window.location.pathname === '/overlay';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isOverlay ? <OverlayMode /> : <App />}
  </StrictMode>,
)
