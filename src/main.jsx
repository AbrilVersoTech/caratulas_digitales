import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { tienda } from './redux/tienda/configuracion'
import { BrowserRouter } from 'react-router-dom' // Se agrega el Router
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

/* ============================================================
   PUNTO DE ENTRADA PRINCIPAL
   Configuración de Redux Provider y Estilos Globales
   ============================================================ */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* El Provider conecta la lógica de Redux con la interfaz de React */}
    <Provider store={tienda}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
/* ---------------- FIN DE RENDERIZADO ---------------- */