import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { 
  cambiarMateria, cambiarPais, cambiarNivel, 
  obtenerPaisesAsync, obtenerMateriasAsync,
  obtenerArteAsync 
} from '../../redux/tienda/rebanadas/caratulaSlice';
import useSeguridadAbrl from '../../hooks/useSeguridadAbrl';

// 1. Importa el archivo de la marca de agua SVG
import logoWatermark from '../../assets/watermark.svg';

// --- MAPEO DE RESPALDO (Por si la BD no trae icono) ---
const ICONOS_MATERIAS_BACKUP = {
  "Lengua y Literatura": "📚", "Matemática": "📐", "Ciencias Naturales": "🌿", "Estudios Sociales": "🌍", "Inglés": "🔤", "Educación Física": "⚽"
};

const PanelGeneral = () => {
  const despacho = useDispatch();
  
  // Activa la protección de clic derecho y atajos de teclado
  useSeguridadAbrl();
  
  // Extraemos el estado desde Redux (conectado a MySQL)
  const { 
    paises, 
    materias, 
    paisSeleccionado, 
    nivelSeleccionado, 
    materiaSeleccionada, 
    rutaImagen,
    cargando,
    cargandoArte 
  } = useSelector((estado) => estado.caratula);

  // --- ESTADOS LOCALES DE SEGURIDAD PARA EL CÓDIGO ---
  const [codigoAcceso, setCodigoAcceso] = useState('');
  const [estadoCodigo, setEstadoCodigo] = useState('idle'); // idle, loading, valid, invalid
  const [mensajeCodigo, setMensajeCodigo] = useState('');
  const [descargandoPack, setDescargandoPack] = useState(false);
  const [contadorDescargas, setContadorDescargas] = useState(0);

  // --- ESTADOS PARA TIERS DE COSTO COMERCIAL ---
  const [opcionDosDolares, setOpcionDosDolares] = useState(false);
  const [opcionTresDolares, setOpcionTresDolares] = useState(false);

  // 1. Cargar lista de países desde MySQL al iniciar
  useEffect(() => {
    despacho(obtenerPaisesAsync());
  }, [despacho]);

  // 2. Cargar materias desde MySQL cada vez que cambie país o nivel
  useEffect(() => {
    despacho(obtenerMateriasAsync({ idPais: paisSeleccionado, nivel: nivelSeleccionado }));
  }, [paisSeleccionado, nivelSeleccionado, despacho]);

  // 3. Cada vez que cambie la materia seleccionada, buscamos su arte en la BD
  useEffect(() => {
    const materiaActual = materias.find(m => m.NOMBRE_MATERIA === materiaSeleccionada);
    if (materiaActual) {
      despacho(obtenerArteAsync(materiaActual.ID_MATERIA));
    }
  }, [materiaSeleccionada, materias, despacho]);

  // --- LÓGICA DE TAMAÑO DE TEXTO DINÁMICO ---
  const calcularTamañoFuente = (texto) => {
    const largo = texto?.length || 0;
    if (largo < 15) return '4.5rem';
    if (largo < 25) return '3rem';
    if (largo < 40) return '2.2rem';
    return '1.8rem';
  };

  // Obtener datos del país seleccionado para la previsualización
  const infoPaisActual = paises.find(p => p.ID_PAIS === parseInt(paisSeleccionado)) || { NOMBRE_PAIS: 'Ecuador', BANDERA_EMOJI: '🇪🇨' };

  // --- FUNCIÓN DE VERIFICACIÓN CON EL BACKEND ---
  const manejarCambioCodigo = (e) => {
    setCodigoAcceso(e.target.value.toUpperCase());
    setEstadoCodigo('idle');
    setMensajeCodigo('');
    setContadorDescargas(0);
  };

  const limpiarFormularioDescarga = (mensajeFinal = '') => {
    setCodigoAcceso('');
    setEstadoCodigo('idle');
    setOpcionDosDolares(false);
    setOpcionTresDolares(false);
    setDescargandoPack(false);
    setContadorDescargas(0);
    setMensajeCodigo(mensajeFinal);
  };

  const verificarCodigoBD = async () => {
    if (!codigoAcceso.trim()) return;
    setEstadoCodigo('loading');
    
    try {
      const respuesta = await fetch(`http://localhost:5000/api/verificar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoAcceso.trim() })
      });
      const data = await respuesta.json();

      if (data.valido) {
        setEstadoCodigo('valid');
        setContadorDescargas(0);
        setMensajeCodigo('✅ Código validado. Paquete desbloqueado.');
      } else {
        setEstadoCodigo('invalid');
        setMensajeCodigo(`❌ ${data.mensaje}`);
      }
    } catch (error) {
      setEstadoCodigo('invalid');
      setMensajeCodigo('❌ Error de conexión con el servidor.');
    }
  };

  // --- MANEJADORES EXCLUYENTES DE CHECKBOX ---
  const manejarCheckDosDolares = () => {
    setOpcionDosDolares(!opcionDosDolares);
    setOpcionTresDolares(false);
    setContadorDescargas(0);
  };

  const manejarCheckTresDolares = () => {
    setOpcionTresDolares(!opcionTresDolares);
    setOpcionDosDolares(false);
    setContadorDescargas(0);
  };

  const limiteDescargas = opcionDosDolares ? 1 : opcionTresDolares ? 2 : 0;
  const descargaBloqueada = limiteDescargas > 0 && contadorDescargas >= limiteDescargas;

  // --- FUNCIÓN PARA DESCARGAR EL ZIP ---
  const manejarDescargaMaster = async () => {
    if (estadoCodigo !== 'valid' || (!opcionDosDolares && !opcionTresDolares) || descargandoPack || descargaBloqueada) return;

    const tierSelection = opcionDosDolares ? 'simple' : 'completo';
    const limiteActual = tierSelection === 'simple' ? 1 : 2;
    setDescargandoPack(true);

    try {
      const respuesta = await fetch(`http://localhost:5000/api/descargar-pack/${paisSeleccionado}/${encodeURIComponent(nivelSeleccionado)}?tier=${tierSelection}`);
      if (!respuesta.ok) throw new Error('No se pudo generar el paquete.');

      const blob = await respuesta.blob();
      const disposition = respuesta.headers.get('content-disposition') || '';
      const match = disposition.match(/filename="?([^";]+)"?/i);
      const nombreArchivo = match?.[1] || `AbrlVerso-${nivelSeleccionado}-${tierSelection}.zip`;
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = nombreArchivo;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);

      const nuevoContador = contadorDescargas + 1;
      setContadorDescargas(nuevoContador);

      if (tierSelection === 'simple' && nuevoContador >= limiteActual) {
        limpiarFormularioDescarga('Descarga exitosa. Para continuar, ingrese un nuevo código de activación.');
      } else if (tierSelection === 'completo' && nuevoContador >= limiteActual) {
        limpiarFormularioDescarga('Descargas completadas. Si desea continuar, ingrese un nuevo código de activación.');
      } else {
        setMensajeCodigo(`✅ Descarga ${nuevoContador} de ${limiteActual} completada. Puede descargar nuevamente el nivel actual o cambiar país/nivel para la descarga restante.`);
      }
    } catch (error) {
      setMensajeCodigo('❌ No se pudo generar la descarga. Intente nuevamente.');
    } finally {
      setDescargandoPack(false);
    }
  };

  // CONFIGURACIÓN DINÁMICA WHATSAPP (USANDO SU ARCHIVO SVG)
  const numeroWA = "593987847201";
  const mensajeWA = encodeURIComponent(
    "Hola, mi nombre es: [ESCRIBA SU NOMBRE AQUÍ]. Deseo el código de activación para obtener las carátulas. Adjunto mi comprobante de pago."
  );

  return (
    <Container fluid className="py-5 animate__animated animate__fadeIn">
      <style>
        {`
          @keyframes icon-bounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.2); } }
          .icon-animated { display: inline-block; animation: icon-bounce 0.6s ease infinite; }
          .btn-level { transition: all 0.3s ease; height: 85px; }
          .btn-level:active { transform: scale(0.95); }
          
          /* CLASES CONTROLADAS DE PREVISUALIZACIÓN MULTIPLATAFORMA */
          .preview-card-viewport {
            width: 100%;
            min-height: 750px;
            position: relative;
            border: 12px solid #1e293b;
            background-color: #ffffff;
            transition: all 0.3s ease;
          }

          .preview-container { user-select: none; -webkit-user-drag: none; }
          .preview-container img { pointer-events: none; }

          .form-check-input:checked {
            background-color: var(--abrl-naranja) !important;
            border-color: var(--abrl-naranja) !important;
          }

          .whatsapp-link-container {
            display: inline-block;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .whatsapp-img-file { 
            width: 75px; 
            height: 75px; 
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          }
          .whatsapp-link-container:hover { 
            transform: scale(1.2) rotate(5deg);
          }
          .whatsapp-link-container:hover .whatsapp-img-file {
            filter: drop-shadow(0 0 15px var(--abrl-naranja));
          }

          /* --- RESPONSIVE OPTIMIZATION (SMARTPHONES Y TABLETAS) --- */
          @media (max-width: 991px) {
            .preview-card-viewport {
              min-height: 520px !important;
              border: 8px solid #1e293b !important;
              max-width: 440px; /* Tamaño estilizado tipo cuaderno */
              margin: 0 auto 15px auto;
            }
            .preview-card-viewport .p-5 {
              padding: 1.5rem !important; /* Reducción de padding para consistencia móvil */
            }
            .preview-card-viewport h1.texto-bubble {
              font-size: 2.2rem !important; /* Control de desbordamiento de fuente */
            }
          }

          /* --- RESPONSIVE OPTIMIZATION (SMART TV / 4K LARGE SCREENS) --- */
          @media (min-width: 1920px) {
            .preview-card-viewport {
              max-width: 520px; /* Evita que crezca desproporcionadamente a lo ancho */
              min-height: 720px !important;
              margin: 0 auto;
            }
          }
        `}
      </style>

      {/* flex-column-reverse apila el preview arriba en móvil, flex-lg-row lo regresa a la derecha en web */}
      <Row className="justify-content-center g-4 flex-column-reverse flex-lg-row align-items-center">
        
        {/* COLUMNA DEL FORMULARIO COMERCIAL */}
        <Col xs={12} lg={4}>
          <Card className="card-admin border-0 shadow-lg bg-dark text-white p-4">
            <Card.Body>
              <h3 className="text-center mb-4" style={{ color: 'var(--abrl-naranja)', fontWeight: '800' }}>SISTEMA LIVE BD</h3>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">País de Origen</Form.Label>
                  <Form.Select 
                    value={paisSeleccionado}
                    onChange={(e) => despacho(cambiarPais(e.target.value))}
                    className="bg-secondary border-0 text-white"
                  >
                    {paises.map(p => (
                      <option key={p.ID_PAIS} value={p.ID_PAIS}>{p.BANDERA_EMOJI} {p.NOMBRE_PAIS}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">Nivel Educativo</Form.Label>
                  <div className="d-flex gap-2">
                    <Button variant={nivelSeleccionado === 'Básica' ? 'primary' : 'outline-light'} className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 btn-level" onClick={() => despacho(cambiarNivel('Básica'))}>
                      <span className={nivelSeleccionado === 'Básica' ? 'icon-animated' : ''} style={{fontSize: '1.5rem'}}>🏫</span>
                      <span style={{fontSize: '0.85rem'}}>Escuela / Básica</span>
                    </Button>
                    <Button variant={nivelSeleccionado === 'Superior' ? 'primary' : 'outline-light'} className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 btn-level" onClick={() => despacho(cambiarNivel('Superior'))}>
                      <span className={nivelSeleccionado === 'Superior' ? 'icon-animated' : ''} style={{fontSize: '1.5rem'}}>🎓</span>
                      <span style={{fontSize: '0.85rem'}}>Colegio / Superior</span>
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase">Materia Especializada</Form.Label>
                  {cargando ? (
                    <div className="py-2 text-center"><Spinner animation="border" size="sm" variant="light" /></div>
                  ) : (
                    <Form.Select value={materiaSeleccionada} onChange={(e) => despacho(cambiarMateria(e.target.value))} className="bg-secondary border-0 text-white py-2">
                      {materias.map(m => (<option key={m.ID_MATERIA} value={m.NOMBRE_MATERIA}>{m.ICONO_EMOJI || "📝"} {m.NOMBRE_MATERIA}</option>))}
                    </Form.Select>
                  )}
                </Form.Group>

                <hr className="my-4 opacity-25" />

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase" style={{ color: 'var(--abrl-naranja)' }}>🔑 Código de Activación</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control type="text" placeholder="Ej: SAFE-PX41..." className="bg-secondary border-0 text-white py-2 text-center fw-bold text-uppercase" value={codigoAcceso} onChange={manejarCambioCodigo} disabled={estadoCodigo === 'valid'} autoComplete="off" />
                    <Button variant={estadoCodigo === 'valid' ? 'success' : 'primary'} onClick={verificarCodigoBD} disabled={!codigoAcceso || estadoCodigo === 'loading' || estadoCodigo === 'valid'} style={{ minWidth: '120px', fontWeight: 'bold' }}>
                      {estadoCodigo === 'loading' ? <Spinner size="sm" animation="border" /> : estadoCodigo === 'valid' ? 'ACTIVO ✔️' : 'VERIFICAR'}
                    </Button>
                  </div>
                  {mensajeCodigo && <div className={`mt-2 small fw-bold text-end ${estadoCodigo === 'valid' ? 'text-success' : 'text-danger'}`}>{mensajeCodigo}</div>}
                </Form.Group>

                {/* --- SECCIÓN OBLIGATORIA DE CONFIGURACIÓN COMERCIAL COMBO CHECKBOXES --- */}
                <Form.Group className="mb-4 p-3 rounded" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <Form.Label className="fw-bold small text-uppercase mb-2 d-block" style={{ color: 'var(--abrl-naranja)', letterSpacing: '0.5px' }}>
                    💰 Tipo de Licencia / Descarga
                  </Form.Label>
                  <Form.Check 
                    type="checkbox"
                    id="check-tier-2"
                    label="📦 Licencia Pack Simple ($2.00) - Solo 1 Nivel"
                    checked={opcionDosDolares}
                    onChange={manejarCheckDosDolares}
                    className="fw-bold small mb-2 text-white"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="check-tier-3"
                    label="✨ Licencia Pack Completo ($3.00) - Básica + Superior"
                    checked={opcionTresDolares}
                    onChange={manejarCheckTresDolares}
                    className="fw-bold small text-white"
                  />
                </Form.Group>

                <Button 
                  onClick={manejarDescargaMaster} 
                  className="btn-abrl w-100 py-3 shadow-lg" 
                  disabled={estadoCodigo !== 'valid' || (!opcionDosDolares && !opcionTresDolares) || descargandoPack || descargaBloqueada}
                >
                  {descargandoPack ? 'GENERANDO...' : 'GENERAR PACK 📦'}
                </Button>

                {/* --- BLOQUE DE CONTACTO: USANDO SU ARCHIVO whatsappLogo.svg --- */}
                <div className="text-center mt-4 animate__animated animate__fadeIn">
                  <p className="mb-1 small text-uppercase opacity-75 fw-bold" style={{ letterSpacing: '1px' }}>Para obtener su código contactar:</p>
                  <a href={`https://wa.me/${numeroWA}?text=${mensajeWA}`} target="_blank" rel="noreferrer" className="whatsapp-link-container">
                    <img src="/icono_mensaje/whatsappLogo.svg" alt="WhatsApp" className="whatsapp-img-file" />
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DE PREVISUALIZACIÓN MULTIPLATAFORMA (PREVIO) */}
        <Col xs={12} lg={6}>
          <div className="preview-container preview-card-viewport shadow-2xl rounded-4 overflow-hidden">
            <div className="p-5 d-flex flex-column h-100 text-center" style={{ backgroundColor: '#ffffff' }}>
              <div className="mb-4">
                <span className="badge bg-dark px-3 py-2 text-uppercase" style={{ letterSpacing: '1px' }}>
                   {infoPaisActual.BANDERA_EMOJI} {infoPaisActual.NOMBRE_PAIS} • {nivelSeleccionado === 'Básica' ? '🏫 Básica' : '🎓 Superior'}
                </span>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <h1 className="texto-bubble animate__animated animate__bounceInDown" style={{ fontSize: calcularTamañoFuente(materiaSeleccionada), marginBottom: '-20px', zIndex: 2 }}>{materiaSeleccionada}</h1>
                <div className="mx-auto d-flex align-items-center justify-content-center flex-grow-1" style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <div className="watermark-overlay">
                    {[...Array(9)].map((_, i) => (<img key={i} src={logoWatermark} className="watermark-img" alt="Watermark" />))}
                  </div>
                  {cargandoArte ? (<Spinner animation="grow" variant="primary" />) : rutaImagen ? (
                    <img src={rutaImagen} alt="Arte IA" className="animate__animated animate__zoomIn" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (<div className="text-center p-4 opacity-25"><span className="display-1 d-block">🖼️</span></div>)}
                </div>
              </div>
              <div className="mt-4">
                <span style={{ color: 'var(--abrl-naranja)', fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.9rem' }}>ABRLVERSO LATAM AI</span>

                
              </div>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default PanelGeneral;
