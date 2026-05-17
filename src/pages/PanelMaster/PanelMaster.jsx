import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Se añade axios para la descarga del PDF PRO
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { 
  actualizarDatos, cambiarMateria, cambiarPais, cambiarNivel,
  obtenerPaisesAsync, obtenerMateriasAsync, obtenerArteAsync 
} from "../../redux/tienda/rebanadas/caratulaSlice.js";

// 1. Importa el archivo de la marca de agua
import logoWatermark from '../../assets/watermark.svg';

const PanelMaster = () => {
  const despacho = useDispatch();
  
  // --- ESTADOS GLOBALES ---
  const { 
    datosEstudiante, materiaSeleccionada, paisSeleccionado, nivelSeleccionado,
    paises, materias, rutaImagen, cargando, cargandoArte 
  } = useSelector((estado) => estado.caratula);

  // --- ESTADOS LOCALES ---
  const [esModoPersonalizado, setEsModoPersonalizado] = useState(false);
  const [generando, setGenerando] = useState(false); 

  // --- EFECTOS ---
  useEffect(() => { despacho(obtenerPaisesAsync()); }, [despacho]);
  useEffect(() => { despacho(obtenerMateriasAsync({ idPais: paisSeleccionado, nivel: nivelSeleccionado })); }, [paisSeleccionado, nivelSeleccionado, despacho]);

  useEffect(() => {
    const materiaActual = materias.find(m => m.NOMBRE_MATERIA === materiaSeleccionada);
    if (materiaActual) { despacho(obtenerArteAsync(materiaActual.ID_MATERIA)); }
  }, [materiaSeleccionada, materias, despacho]);

  // --- MANEJADORES ---
  const manejarCambioTexto = (evento) => {
    const { name, value } = evento.target;
    if (name === 'nombre') {
      const regexSoloLetrasYEspacios = /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]*$/;
      if (!regexSoloLetrasYEspacios.test(value)) return;
    }
    despacho(actualizarDatos({ campo: name, valor: value }));
  };

  // FUNCIONALIDAD DE GENERACIÓN MASTER CON DESCARGA REAL (ZIP GENERAL / ZIP PRO)
  const manejarGenerarMaster = async () => {
    if (!paisSeleccionado || !nivelSeleccionado) return;
    setGenerando(true);
    
    try {
        if (!esModoPersonalizado) {
            // DESCARGA GENERAL (ZIP sin nombres)
            window.location.href = `http://localhost:5000/api/descargar-pack/${paisSeleccionado}/${nivelSeleccionado}`;
        } else {
            // DESCARGA PRO (ZIP Personalizado con todas las materias)
            const respuesta = await axios({
                url: 'http://localhost:5000/api/descargar-pack-pro',
                method: 'POST',
                data: {
                    idPais: paisSeleccionado,
                    nivel: nivelSeleccionado,
                    nombre: datosEstudiante.nombre,
                    grado: datosEstudiante.grado
                },
                responseType: 'blob' 
            });

            const url = window.URL.createObjectURL(new Blob([respuesta.data]));
            const link = document.createElement('a');
            link.href = url;

            // Formato de nombre solicitado: PAIS-NIVEL_PROAbrlVerso.zip
            const infoPaisActual = paises.find(p => p.ID_PAIS === parseInt(paisSeleccionado)) || { NOMBRE_PAIS: 'Pais' };
            const nombreArchivo = `${infoPaisActual.NOMBRE_PAIS}-${nivelSeleccionado}_PROAbrilVerso.zip`;

            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    } catch (error) {
        console.error("Error en la descarga:", error);
        alert("Error al generar el paquete comprimido. Revisa la consola.");
    } finally {
        setTimeout(() => setGenerando(false), 1500);
    }
  };

  const calcularTamañoFuente = (texto) => {
    const largo = texto?.length || 0;
    if (largo < 15) return '4rem';
    if (largo < 25) return '3rem';
    return '2.2rem';
  };

  const infoPaisActual = paises.find(p => p.ID_PAIS === parseInt(paisSeleccionado)) || { NOMBRE_PAIS: 'Ecuador', BANDERA_EMOJI: '🇪🇨' };

  return (
    <Container fluid className="py-5 animate__animated animate__fadeIn">
      <style>
        {`
          /* REGISTRO DE FUENTE SUPER BUBBLE */
          @font-face {
            font-family: 'Super Bubble';
            src: url('/fonts/Super Bubble.ttf') format('truetype');
          }

          @keyframes icon-bounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.2); } }
          .icon-animated { display: inline-block; animation: icon-bounce 0.6s ease infinite; }
          .btn-level { transition: all 0.3s ease; height: 85px; }
          .input-custom { background: #334155 !important; border: none !important; color: white !important; }
          .input-custom:disabled { background: #1e293b !important; opacity: 0.5; cursor: not-allowed; }
          .form-check-input:checked { background-color: var(--abrl-naranja) !important; border-color: var(--abrl-naranja) !important; }

          /* ESTILOS DE PREVISUALIZACIÓN UNIFICADOS */
          .texto-bubble { 
            font-family: 'Super Bubble', sans-serif; 
            color: white; 
            text-shadow: -3px -3px 0 #1c2841, 3px -3px 0 #1c2841, -3px 3px 0 #1c2841, 3px 3px 0 #1c2841;
          }
          .label-bubble {
            font-family: 'Super Bubble', sans-serif;
            color: #ff5722;
            -webkit-text-stroke: 1px white;
          }
          .valor-bubble {
            font-family: 'Super Bubble', sans-serif;
            color: #1c2841;
            text-shadow: 1px 1px 0 white;
          }
        `}
      </style>

      <Row className="justify-content-center g-4">
        <Col lg={4}>
          <Card className="card-admin border-0 shadow-lg bg-dark text-white p-4">
            <Card.Body>
              <h3 className="text-center mb-2" style={{ color: 'var(--abrl-naranja)', fontWeight: '800' }}>DISEÑO MASTER</h3>
              
              <div className="d-flex justify-content-center mb-4">
                <Form.Check 
                  type="switch"
                  id="modo-hibrido"
                  label={esModoPersonalizado ? "✨ Modo Personalizado Activo" : "📦 Modo General (Sin Datos)"}
                  checked={esModoPersonalizado}
                  onChange={(e) => setEsModoPersonalizado(e.target.checked)}
                  className="fw-bold small text-uppercase"
                  style={{ color: esModoPersonalizado ? 'var(--abrl-naranja)' : '#94a3b8' }}
                />
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">Nombre del Estudiante</Form.Label>
                  <Form.Control type="text" name="nombre" className="input-custom py-2" value={datosEstudiante.nombre} onChange={manejarCambioTexto} disabled={!esModoPersonalizado} placeholder={esModoPersonalizado ? "Escriba el nombre..." : "Deshabilitado en Modo General"} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">Curso / Grado</Form.Label>
                  <Form.Control type="text" name="grado" className="input-custom py-2" value={datosEstudiante.grado} onChange={manejarCambioTexto} disabled={!esModoPersonalizado} placeholder={esModoPersonalizado ? "Escriba el curso..." : "Deshabilitado en Modo General"} />
                </Form.Group>
                <hr className="my-4 opacity-25" />
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">País</Form.Label>
                  <Form.Select value={paisSeleccionado} onChange={(e) => despacho(cambiarPais(e.target.value))} className="bg-secondary border-0 text-white">
                    {paises.map(p => (<option key={p.ID_PAIS} value={p.ID_PAIS}>{p.BANDERA_EMOJI} {p.NOMBRE_PAIS}</option>))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-uppercase">Nivel</Form.Label>
                  <div className="d-flex gap-2">
                    <Button variant={nivelSeleccionado === 'Básica' ? 'primary' : 'outline-light'} className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 btn-level" onClick={() => despacho(cambiarNivel('Básica'))}>
                      <span className={nivelSeleccionado === 'Básica' ? 'icon-animated' : ''} style={{fontSize: '1.5rem'}}>🏫</span>
                      <span style={{fontSize: '0.85rem'}}>Básica</span>
                    </Button>
                    <Button variant={nivelSeleccionado === 'Superior' ? 'primary' : 'outline-light'} className="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1 btn-level" onClick={() => despacho(cambiarNivel('Superior'))}>
                      <span className={nivelSeleccionado === 'Superior' ? 'icon-animated' : ''} style={{fontSize: '1.5rem'}}>🎓</span>
                      <span style={{fontSize: '0.85rem'}}>Superior</span>
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-uppercase">Materia</Form.Label>
                  {cargando ? (<div className="text-center py-2"><Spinner animation="border" size="sm" variant="light" /></div>) : (
                    <Form.Select value={materiaSeleccionada} onChange={(e) => despacho(cambiarMateria(e.target.value))} className="bg-secondary border-0 text-white py-2">
                      {materias.map(mat => (<option key={mat.ID_MATERIA} value={mat.NOMBRE_MATERIA}>{mat.ICONO_EMOJI} {mat.NOMBRE_MATERIA}</option>))}
                    </Form.Select>
                  )}
                </Form.Group>
                <hr className="my-4 opacity-25" />

                <Button 
                  onClick={manejarGenerarMaster}
                  className={`btn-abrl w-100 py-3 shadow-lg ${generando ? 'animate__animated animate__pulse animate__infinite' : ''}`}
                  disabled={generando}
                >
                  {generando ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      PROCESANDO...
                    </>
                  ) : (
                    `GENERAR ${esModoPersonalizado ? 'PACK PRO' : 'PACK GENERAL'} 🎨`
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <div className="preview-container shadow-2xl rounded-4 overflow-hidden bg-white" style={{ minHeight: '750px', position: 'relative', border: '12px solid #1e293b' }}>
            <div className="p-5 d-flex flex-column h-100 text-center">
              <div className="mb-2">
                <span className="badge bg-dark px-3 py-2 text-uppercase" style={{ letterSpacing: '2px' }}>
                   {infoPaisActual.BANDERA_EMOJI} {infoPaisActual.NOMBRE_PAIS} • {nivelSeleccionado === 'Básica' ? '🏫 Educación Básica' : '🎓 Superior'}
                </span>
              </div>

              <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <h1 className="texto-bubble animate__animated animate__bounceInDown" style={{ fontSize: calcularTamañoFuente(materiaSeleccionada), lineHeight: '1.1', marginBottom: '-15px', zIndex: 2 }}>
                  {materiaSeleccionada}
                </h1>
                <div className="mx-auto d-flex align-items-center justify-content-center flex-grow-1" style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                  
                  {/* Capa de Marca de Agua SVG */}
                  <div className="watermark-overlay">
                    {[...Array(9)].map((_, i) => (
                      <img key={i} src={logoWatermark} className="watermark-img" alt="Watermark" />
                    ))}
                  </div>

                  {cargandoArte ? (<Spinner animation="grow" variant="primary" />) : rutaImagen ? (
                    <img src={rutaImagen} alt="Arte IA" className="animate__animated animate__fadeIn" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (<div className="text-center p-4"><span className="display-4 d-block mb-2" style={{ opacity: 0.1 }}>🖼️</span></div>)}
                </div>
              </div>

              {esModoPersonalizado && (
                <div className="mt-4 text-start px-4 pb-4 animate__animated animate__fadeInUp">
                  <div className="mb-4">
                    <label className="fw-black text-uppercase mb-0 label-bubble" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Estudiante:</label>
                    <div className="valor-bubble" style={{fontSize: '3rem', marginTop: '-10px'}}>{datosEstudiante.nombre || '__________________________'}</div>
                  </div>
                  <div>
                    <label className="fw-black text-uppercase mb-0 label-bubble" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Curso / Grado:</label>
                    <div className="valor-bubble" style={{ minHeight: '50px', fontSize: '2.5rem', paddingTop: '5px', whiteSpace: 'pre-wrap', marginTop: '-10px' }}>{datosEstudiante.grado || '__________________________'}</div>
                  </div>
                </div>
              )}

              <div className="text-end mt-auto pt-3">
                <span style={{ color: 'var(--abrl-naranja)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px' }}>
                  ABRLVERSO MASTER AI {esModoPersonalizado ? '[PRO]' : '[GEN]'}
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

export default PanelMaster;