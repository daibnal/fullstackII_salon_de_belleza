import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MiAppIdk } from './MiAppIdk'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MiAppIdk />
  </StrictMode>
)
