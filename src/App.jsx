import React, { useState } from 'react';
import { Navbar, Container, Button, Nav, Modal, Form } from 'react-bootstrap'; 
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
// Importamos las páginas
import PaginaInicio from './pages/Bienvenida/PaginaInicio';
import PanelInicio from './pages/PanelInicio/PanelInicio';
import PanelGeneral from './pages/PanelGeneral/PanelGeneral';
import PanelMaster from './pages/PanelMaster/PanelMaster'; 

/* ============================================================
   COMPONENTE PRINCIPAL (RAÍZ)
   Gestiona la navegación real por URL y mantiene la UI consistente.
   ============================================================ */
function App() {
  const navegar = useNavigate();
  const localizacion = useLocation();

  // --- ESTADOS PARA EL ACCESO MAESTRO ---
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clave, setClave] = useState('');
  const [errorClave, setErrorClave] = useState(false);

  // Determinamos la "vistaActual" basándonos en la URL real para mantener la lógica de tu Navbar
  const obtenerVistaActual = () => {
    if (localizacion.pathname === '/') return 'inicio';
    if (localizacion.pathname === '/admin-personal') return 'admin-personal';
    if (localizacion.pathname === '/admin-general') return 'admin-general';
    return 'master';
  };

  const vistaActual = obtenerVistaActual();

  // --- LÓGICA DE ACCESO SECRETO (Ctrl + Click en el Logo) ---
  const manejarAccesoSecreto = (e) => {
    if (e.ctrlKey) {
      setMostrarModal(true);
      setClave('');
      setErrorClave(false);
    }
  };

  const verificarClaveMaster = () => {
    // Clave de alta seguridad definida para el Ingeniero (incluye Ñ)
    if (clave === 'Ñ_Sist3m@_AbrlV3rso_2026_Acc3ss_#1') {
      setMostrarModal(false);
      setClave(''); // Limpiamos el campo
      setErrorClave(false);
      navegar('/panel-master-diego');
    } else {
      setErrorClave(true);
    }
  };

  return (
    <div className="App d-flex flex-column" style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      
      {/* HEADER: Diseño oscuro para máxima visibilidad */}
      <Navbar variant="dark" style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }} className="shadow-lg py-3">
        <Container fluid className="px-4">
          
          <Navbar.Brand>
            <h2 className="m-0 text-white fw-bold">
              <span style={{color: 'var(--abrl-naranja)'}}>ABRL</span>VERSO
            </h2>
          </Navbar.Brand>
          
          <Nav className="ms-auto gap-2">
            {vistaActual === 'inicio' ? (
              <Button onClick={() => navegar('/admin-general')} className="btn-abrl-outline border-white text-white">
                Generador de Carátulas 🖼️
              </Button>
            ) : (
              <>
                {/* Solo mostrar botones de modo si NO estamos en Modo Master */}
                {vistaActual !== 'master' && (
                  <>
                    <Button 
                      variant={vistaActual === 'admin-general' ? 'light' : 'outline-light'} 
                      onClick={() => navegar('/admin-general')}
                      size="sm"
                    >
                      Modo General (Packs)
                    </Button>
                    <Button 
                      variant={vistaActual === 'admin-personal' ? 'light' : 'outline-light'} 
                      onClick={() => navegar('/admin-personal')}
                      size="sm"
                    >
                      Modo Personalizado
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => navegar('/')}
                >
                  Salir
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* SISTEMA DE RUTAS: Orquestación de componentes según la URL */}
      <main className="flex-grow-1">
        <Container fluid className="p-0">
          <Routes>
            <Route path="/" element={<PaginaInicio />} />
            <Route path="/admin-personal" element={<PanelInicio />} />
            <Route path="/admin-general" element={<PanelGeneral />} />
            <Route path="/panel-master-diego" element={<PanelMaster />} />
          </Routes>
        </Container>
      </main>

      {/* --- PIE DE PÁGINA ÚNICO Y DEFINITIVO --- */}
      <footer className="text-center py-4 text-white-50 small" style={{ backgroundColor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="mb-2">© 2026 AbrlVerso | Ingeniería de T.I</p>
        
        {/* BOTÓN SECRETO: Logo corporativo centrado y funcional solo en Inicio */}
        {vistaActual === 'inicio' && (
          <div 
            onClick={manejarAccesoSecreto} 
            style={{ 
              cursor: 'pointer', 
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
          >
            <img 
              src="/piepaginaLogo/logoFooter.svg" 
              alt="Acceso Maestro" 
              style={{ 
                width: '55px', 
                opacity: 0.4, 
                transition: 'all 0.3s ease',
                /* Filtro para convertir el logo al naranja corporativo */
                filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(343deg) brightness(101%) contrast(101%)' 
              }} 
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.4'}
              title="Acceso de Seguridad (Ctrl + Click)"
            />
          </div>
        )}
      </footer>

      {/* MODAL DE SEGURIDAD MAESTRA */}
      <Modal show={mostrarModal} onHide={() => {setMostrarModal(false); setErrorClave(false);}} centered>
        <Modal.Header closeButton className="bg-dark text-white border-0">
          <Modal.Title className="fw-bold">Acceso Desarrollador</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form.Group>
            <Form.Label>Ingrese su clave maestra, Ingeniero:</Form.Label>
            <Form.Control 
              type="password" 
              className="bg-secondary text-white border-0 py-2"
              value={clave}
              onChange={(e) => { setClave(e.target.value); setErrorClave(false); }}
              placeholder="Contraseña con Ñ..."
              autoFocus
            />
            {errorClave && <small className="text-danger d-block mt-2 fw-bold text-center">Acceso Denegado: Clave Incorrecta.</small>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-0">
          <Button variant="outline-light" onClick={() => setMostrarModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={verificarClaveMaster} className="fw-bold px-4">VALIDAR</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;