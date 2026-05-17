import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Se añade axios para la descarga
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { 
  actualizarDatos, 
  cambiarMateria, 
  cambiarPais, 
  cambiarNivel,
  obtenerPaisesAsync,
  obtenerMateriasAsync,
  obtenerArteAsync 
} from "../../redux/tienda/rebanadas/caratulaSlice.js";

// 1. Importa el archivo de la marca de agua
import logoWatermark from '../../assets/watermark.svg';

const PanelInicio = () => {
  const despacho = useDispatch();
  
  // Extraemos el estado global conectado a MySQL
  const { 
    datosEstudiante, 
    materiaSeleccionada, 
    paisSeleccionado, 
    nivelSeleccionado,
    paises,
    materias,
    rutaImagen,      
    cargando,
    cargandoArte     
  } = useSelector((estado) => estado.caratula);

  // --- ESTADOS LOCALES DE SEGURIDAD PARA EL CÓDIGO ---
  const [codigoAcceso, setCodigoAcceso] = useState('');
  const [estadoCodigo, setEstadoCodigo] = useState('idle'); // idle, loading, valid, invalid
  const [mensajeCodigo, setMensajeCodigo] = useState('');
  const [generando, setGenerando] = useState(false); // Estado para la descarga

  // --- ESTADOS PARA TIERS DE COSTO COMERCIAL ---
  const [opcionDosDolares, setOpcionDosDolares] = useState(false);
  const [opcionTresDolares, setOpcionTresDolares] = useState(false);

  // 1. Sincronización Inicial: Cargar países desde la BD (Corregido tipografía especial)
  useEffect(() => {
    despacho(obtenerPaisesAsync());
  }, [despacho]);

  // 2. Sincronización Dinámica: Cargar materias según país/nivel seleccionado
  useEffect(() => {
    despacho(obtenerMateriasAsync({ idPais: paisSeleccionado, nivel: nivelSeleccionado }));
  }, [paisSeleccionado, nivelSeleccionado, despacho]);

  // 3. Buscar arte IA cuando cambie la materia seleccionada
  useEffect(() => {
    const materiaActual = materias.find(m => m.NOMBRE_MATERIA === materiaSeleccionada);
    if (materiaActual) {
      despacho(obtenerArteAsync(materiaActual.ID_MATERIA));
    }
  }, [materiaSeleccionada, materias, despacho]);

  /* ============================================================
     LÓGICA DE CONTROL (MANEJADORES)
     ============================================================ */
  const manejarCambioTexto = (evento) => {
    const { name, value } = evento.target;

    if (name === 'nombre') {
      const regexSoloLetrasYEspacios = /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]*$/;
      if (!regexSoloLetrasYEspacios.test(value)) return;
    }
    
    despacho(actualizarDatos({ campo: name, valor: value }));
  };

  // --- MEJORA: SOLUCIÓN FINAL AL ERROR DE REFERENCIA EN LÍNEA 77 ---
  const calcularTamañoFuente = (texto) => {
    const largo = texto?.length || 0; // Corregido de 'text' a 'texto'
    if (largo < 15) return '4rem';
    if (largo < 25) return '3rem';
    return '2.2rem';
  };

  // --- FUNCIÓN DE VERIFICACIÓN CON EL BACKEND ---
  const manejarCambioCodigo = (e) => {
    setCodigoAcceso(e.target.value.toUpperCase());
    setEstadoCodigo('idle');
    setMensajeCodigo('');
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
        setMensajeCodigo('✅ Código activado. Diseño listo para exportar.');
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
  };

  const manejarCheckTresDolares = () => {
    setOpcionTresDolares(!opcionTresDolares);
    setOpcionDosDolares(false);
  };

  // --- FUNCIÓN PARA GENERACIÓN REAL (DESCARGA ZIP PRO) ---
  const manejarGenerarCaratula = async () => {
    if (estadoCodigo !== 'valid' || (!opcionDosDolares && !opcionTresDolares)) return;
    setGenerando(true);
    
    try {
        const respuesta = await axios({
            url: 'http://localhost:5000/api/descargar-pack-pro',
            method: 'POST',
            data: {
                idPais: paisSeleccionado,
                nivel: nivelSeleccionado,
                nombre: datosEstudiante.nombre,
                grado: datosEstudiante.grado,
                tierComercial: opcionDosDolares ? 'simple' : 'completo'
            },
            responseType: 'blob' 
        });

        const url = window.URL.createObjectURL(new Blob([respuesta.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const infoPais = paises.find(p => p.ID_PAIS === parseInt(paisSeleccionado)) || { NOMBRE_PAIS: 'Pais' };
        link.setAttribute('download', `${infoPais.NOMBRE_PAIS}-${nivelSeleccionado}_Personal.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error en descarga:", error);
        alert("Error al generar el archivo comprimido.");
    } finally {
        setGenerando(false);
    }
  };

  // CONFIGURACIÓN DINÁMICA WHATSAPP
  const numeroWA = "593987847201";
  const mensajeWA = encodeURIComponent(
    "Hola, mi nombre es: [ESCRIBA SU NOMBRE AQUÍ]. Deseo el código de activación para obtener las carátulas. Adjunto mi comprobante de pago."
  );

  const infoPaisActual = paises.find(p => p.ID_PAIS === parseInt(paisSeleccionado)) || { NOMBRE_PAIS: 'Ecuador', BANDERA_EMOJI: '🇪🇨' };

  return (
    <Container fluid className="py-5 animate__animated animate__fadeIn">
      <style>
        {`
          /* REGISTRO ÚNICO DE FUENTE CORRECTA */
          @font-face {
            font-family: 'Super Bubble';
            src: url('/fonts/Super Bubble.ttf') format('truetype');
          }

          @keyframes icon-bounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.2); } }
          .icon-animated { display: inline-block; animation: icon-bounce 0.6s ease infinite; }
          .btn-level { transition: all 0.3s ease; height: 85px; }
          .input-custom { background: #334155 !important; border: none !important; color: white !important; }
          .input-custom::placeholder { color: #94a3b8 !important; }

          .form-check-input:checked {
            background-color: var(--abrl-naranja) !important;
            border-color: var(--abrl-naranja) !important;
          }

          .texto-bubble { 
            font-family: 'Super Bubble', cursive !important; 
          }
          
          .label-personalizado {
            font-family: 'Super Bubble', cursive !important;
            font-size: 0.85rem;
            color: #ff5722;
            letter-spacing: 1px;
            margin-bottom: 0;
            text-transform: uppercase;
          }

          .texto-magic {
            font-family: 'Super Bubble', cursive !important;
            color: #1e293b;
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
          .whatsapp-link-container:hover { transform: scale(1.2) rotate(5deg); }
          .whatsapp-link-container:hover .whatsapp-img-file {
            filter: drop-shadow(0 0 15px var(--abrl-naranja));
          }

          /* CLASES CONTROLADAS DE PREVISUALIZACIÓN MULTIPLATAFORMA */
          .preview-card-viewport-personal {
            width: 100%;
            min-height: 750px;
            position: relative;
            border: 12px solid #1e293b;
            background-color: #ffffff;
            transition: all 0.3s ease;
          }

          /* --- OPTIMIZACIÓN RESPONSIVA (SMARTPHONES Y TABLETAS) --- */
          @media (max-width: 991px) {
            .preview-card-viewport-personal {
              min-height: 540px !important;
              border: 8px solid #1e293b !important;
              max-width: 440px; /* Proporción estética tipo cuaderno real */
              margin: 0 auto 15px auto;
            }
            .preview-card-viewport-personal .p-5 {
              padding: 1.5rem !important; /* Consistencia en los márgenes móviles */
            }
            .preview-card-viewport-personal h1.texto-bubble {
              font-size: 1.8rem !important;
            }
            .preview-card-viewport-personal .texto-magic {
              font-size: 2.2rem !important; /* Previene desbordamiento en nombres largos */
            }
          }

          /* --- OPTIMIZACIÓN RESPONSIVA (SMART TV / 4K PANELS) --- */
          @media (min-width: 1920px) {
            .preview-card-viewport-personal {
              max-width: 520px; /* Previene estiramiento horizontal en TVs */
              min-height: 720px !important;
              margin: 0 auto;
            }
          }
        `}
      </style>

      {/* flex-column-reverse renderiza el preview arriba en teléfonos y flex-lg-row lo retorna al lateral en PC */}
      <Row className="justify-content-center g-4 flex-column-reverse flex-lg-row align-items-center">
        
        {/* COLUMNA DE ENTRADA DE DATOS */}
        <Col xs={12} lg={4}>
          <Card className="card-admin border-0 shadow-lg bg-dark text-white p-4">
            <Card.Body>
              <h3 className="text-center mb-4" style={{ color: 'var(--abrl-naranja)', fontWeight: '800' }}>DISEÑO PERSONAL</h3>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">Nombre del Estudiante</Form.Label>
                  <Form.Control 
                    type="text"
                    name="nombre"
                    className="input-custom py-2"
                    value={datosEstudiante.nombre}
                    onChange={manejarCambioTexto}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">Curso / Grado</Form.Label>
                  <Form.Control 
                    type="text"
                    name="grado"
                    className="input-custom py-2"
                    value={datosEstudiante.grado}
                    onChange={manejarCambioTexto}
                  />
                </Form.Group>

                <hr className="my-4 opacity-25" />

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">País</Form.Label>
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
                  <Form.Label className="fw-bold small text-uppercase">Nivel</Form.Label>
                  <div className="d-flex gap-2">
                    <Button 
                      variant={nivelSeleccionado === 'Básica' ? 'primary' : 'outline-light'} 
                      className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 btn-level"
                      onClick={() => despacho(cambiarNivel('Básica'))}
                    >
                      <span className={nivelSeleccionado === 'Básica' ? 'icon-animated' : ''} style={{fontSize: '1.5rem'}}>🏫</span>
                      <span style={{fontSize: '0.85rem'}}>Básica</span>
                    </Button>
                    <Button 
                      variant={nivelSeleccionado === 'Superior' ? 'primary' : 'outline-light'} 
                      className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 btn-level"
                      onClick={() => despacho(cambiarNivel('Superior'))}
                    >
                      <span className={nivelSeleccionado === 'Superior' ? 'icon-animated' : ''} style={{fontSize: '1.5rem'}}>🎓</span>
                      <span style={{fontSize: '0.85rem'}}>Superior</span>
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase">Materia</Form.Label>
                  {cargando ? (
                    <div className="text-center py-2"><Spinner animation="border" size="sm" variant="light" /></div>
                  ) : (
                    <Form.Select 
                      value={materiaSeleccionada} 
                      onChange={(e) => despacho(cambiarMateria(e.target.value))} 
                      className="bg-secondary border-0 text-white py-2"
                    >
                      {materias.map(mat => (
                        <option key={mat.ID_MATERIA} value={mat.NOMBRE_MATERIA}>{mat.ICONO_EMOJI} {mat.NOMBRE_MATERIA}</option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>

                <hr className="my-4 opacity-25" />

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase" style={{ color: 'var(--abrl-naranja)' }}>
                    🔑 Código de Activación
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control 
                      type="text"
                      placeholder="Ingrese su código..."
                      className="bg-secondary border-0 text-white py-2 text-center fw-bold text-uppercase"
                      value={codigoAcceso}
                      onChange={manejarCambioCodigo}
                      disabled={estadoCodigo === 'valid'}
                      autoComplete="off"
                    />
                    <Button 
                      variant={estadoCodigo === 'valid' ? 'success' : 'primary'}
                      onClick={verificarCodigoBD}
                      disabled={!codigoAcceso || estadoCodigo === 'loading' || estadoCodigo === 'valid'}
                      style={{ minWidth: '100px' }}
                    >
                      {estadoCodigo === 'loading' ? <Spinner size="sm" animation="border" /> : estadoCodigo === 'valid' ? '✔' : 'VALIDAR'}
                    </Button>
                  </div>
                  {mensajeCodigo && (
                    <div className={`mt-2 small fw-bold text-end ${estadoCodigo === 'valid' ? 'text-success' : 'text-danger'}`}>
                      {mensajeCodigo}
                    </div>
                  )}
                </Form.Group>

                {/* --- SECCIÓN OBLIGATORIA DE CONFIGURACIÓN COMERCIAL COMBO CHECKBOXES --- */}
                <Form.Group className="mb-4 p-3 rounded" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <Form.Label className="fw-bold small text-uppercase mb-2 d-block" style={{ color: 'var(--abrl-naranja)', letterSpacing: '0.5px' }}>
                    💰 Tipo de Licencia / Descarga
                  </Form.Label>
                  <Form.Check 
                    type="checkbox"
                    id="check-tier-2-personal"
                    label="📦 Licencia Pack Simple ($2.00) - Solo 1 Nivel"
                    checked={opcionDosDolares}
                    onChange={manejarCheckDosDolares}
                    className="fw-bold small mb-2 text-white"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="check-tier-3-personal"
                    label="✨ Licencia Pack Completo ($3.00) - Básica + Superior"
                    checked={opcionTresDolares}
                    onChange={manejarCheckTresDolares}
                    className="fw-bold small text-white"
                  />
                </Form.Group>

                <Button 
                  onClick={manejarGenerarCaratula}
                  className="btn-abrl w-100 py-3 shadow-lg"
                  disabled={estadoCodigo !== 'valid' || generando || (!opcionDosDolares && !opcionTresDolares)}
                >
                  {generando ? <Spinner size="sm" animation="border" /> : 'GENERAR PACK 📦 🎨'}
                </Button>

                {/* BLOQUE DE CONTACTO WHATSAPP LOCAL */}
                <div className="text-center mt-4 animate__animated animate__fadeIn">
                  <p className="mb-1 small text-uppercase opacity-75 fw-bold" style={{ letterSpacing: '1px' }}>
                    Para obtener su código contactar:
                  </p>
                  <a href={`https://wa.me/${numeroWA}?text=${mensajeWA}`} target="_blank" rel="noreferrer" className="whatsapp-link-container">
                    <img src="/icono_mensaje/whatsappLogo.svg" alt="WhatsApp" className="whatsapp-img-file" />
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DE PREVISUALIZACIÓN MULTIPLATAFORMA (PREVIO EN PARTE SUPERIOR) */}
        <Col xs={12} lg={6}>
          <div className="preview-container preview-card-viewport-personal shadow-2xl rounded-4 overflow-hidden">
            <div className="p-5 d-flex flex-column h-100 text-center">
              <div className="mb-2">
                <span className="badge bg-dark px-3 py-2 text-uppercase" style={{ letterSpacing: '2px' }}>
                   {infoPaisActual.BANDERA_EMOJI} {infoPaisActual.NOMBRE_PAIS} • {nivelSeleccionado === 'Básica' ? '🏫 Educación Básica' : '🎓 Superior'}
                </span>
              </div>

              <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <h1 className="texto-bubble animate__animated animate__bounceInDown" 
                    style={{ fontSize: calcularTamañoFuente(materiaSeleccionada), lineHeight: '1.1', marginBottom: '-15px', zIndex: 2 }}>
                  {materiaSeleccionada}
                </h1>

                <div className="mx-auto d-flex align-items-center justify-content-center flex-grow-1" 
                     style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                  
                  <div className="watermark-overlay">
                    {[...Array(9)].map((_, i) => (
                      <img key={i} src={logoWatermark} className="watermark-img" alt="Watermark" />
                    ))}
                  </div>

                  {cargandoArte ? (
                    <Spinner animation="grow" variant="primary" />
                  ) : rutaImagen ? (
                    <img src={rutaImagen} alt="Arte IA" className="animate__animated animate__fadeIn" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div className="text-center p-4">
                      <span className="display-4 d-block mb-2" style={{ opacity: 0.1 }}>🖼️</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-start px-4 pb-4">
                <div className="mb-4">
                  <label className="label-personalizado">Estudiante:</label>
                  <div className="texto-magic">{datosEstudiante.nombre || '__________________________'}</div>
                </div>
                <div>
                  <label className="label-personalizado">Curso / Grado:</label>
                  <div className="texto-magic" style={{ minHeight: '50px', fontSize: '3rem', paddingTop: '5px', whiteSpace: 'pre-wrap' }}>
                    {datosEstudiante.grado || '__________________________'}
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <span style={{ color: 'var(--abrl-naranja)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px' }}>
                  ABRLVERSO LA T.I PERSONAL AI
                </span>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default PanelInicio;