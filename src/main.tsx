import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import '@fontsource/geist-sans/index.css';
import '@fontsource/geist-sans/100.css'; // Thin
import '@fontsource/geist-sans/200.css'; // Italic
import '@fontsource/geist-sans/300.css'; // Light
import '@fontsource/geist-sans/400.css'; // Regular
import '@fontsource/geist-sans/500.css'; // Medium
import '@fontsource/geist-sans/600.css'; // Semi Bold
import '@fontsource/geist-sans/700.css'; // Bold
import '@fontsource/geist-sans/800.css'; // Extra Bold

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
