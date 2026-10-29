import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/principal.css'
import { Navbar } from './pages/Navbar'
import { Carusel } from './pages/Carusel';
import { Footer } from './pages/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <body className="container-fluid p-0">
      <header>
        <Navbar/>
      </header>
      <main className="main-container">
        <Carusel/>
      </main>
      <Footer/>
    </body>
  </StrictMode>
)
