/* import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/principal.css'
import { Navbar } from '../components/Navbar'
import { Carusel } from '../../client/catalogo/components/Carusel';
import { ListadoCards } from '../../client/catalogo/components/ListadoCards';
import { Footer } from '../components/Footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <body className="container-fluid p-0">
      <header>
        <Navbar/>
      </header>
      <main className="main-container">
        <Carusel/>
        <section>
          <ListadoCards/>
        </section>
      </main>
      <Footer/>
    </body>
  </StrictMode>
)
