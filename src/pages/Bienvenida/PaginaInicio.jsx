import React, { useRef, useEffect, useState } from 'react';
import { Container, Button, ProgressBar, Spinner } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom'; 

const PaginaInicio = () => {
  const navegar = useNavigate();
  const canvasRef = useRef(null);
  const contenedorRef = useRef(null);
  
  // Estados para UI
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [vida, setVida] = useState(100);

  // Texto de AbrlVerso
  const textoOriginal = "¡Transforma tus cuadernos con AbrlVerso! Descarga carátulas únicas diseñadas con IA en alta resolución. Listas para imprimir y colorear. ¡La creatividad no tiene límites, personaliza tu mundo hoy mismo!";
  const totalLetras = textoOriginal.replace(/\s/g, '').length;

  // REFS PARA EL MOTOR
  const motorRef = useRef({
    posicionTanqueX: 0,
    teclas: {},
    proyectiles: [],
    letras: [],
    fragmentos: [],
    chispas: [],
    ultimoDisparo: 0,
    estaSiendoGolpeado: false,
    juegoIniciado: false 
  });

  useEffect(() => {
    motorRef.current.juegoIniciado = juegoIniciado;
  }, [juegoIniciado]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const motor = motorRef.current;

    // --- MÈTRICAS DINÁMICAS ADAPTATIVAS PARA PANTALLAS ---
    const obtenerMetricasPantalla = () => {
      const ancho = window.innerWidth;
      if (ancho < 576) {
        return { fontSize: 14, spacing: 9, lineGap: 30, topMargin: 115, tankSpeed: 6 };
      } else if (ancho > 1920) {
        return { fontSize: 32, spacing: 20, lineGap: 55, topMargin: 160, tankSpeed: 12 };
      }
      return { fontSize: 24, spacing: 15, lineGap: 45, topMargin: 140, tankSpeed: 8 };
    };

    const ajustarTamaño = () => {
      if (contenedorRef.current) {
        canvas.width = window.innerWidth;
        // Ajuste de altura dinámico para que no desborde en celulares
        canvas.height = window.innerWidth < 576 ? 500 : 650;
        if (motor.posicionTanqueX === 0) motor.posicionTanqueX = canvas.width / 2 - 25;
      }
    };
    
    ajustarTamaño();
    window.addEventListener('resize', ajustarTamaño);

    // INICIALIZACIÓN DE LETRAS RESPONSIVAS CON AJUSTE DE MARGEN (Separación de 15px respecto al HUD)
    if (motor.letras.length === 0) {
      const metricas = obtenerMetricasPantalla();
      ctx.font = `bold ${metricas.fontSize}px monospace`;
      const palabras = textoOriginal.split(' ');
      let x = window.innerWidth < 576 ? 15 : 80; 
      let y = metricas.topMargin; 

      palabras.forEach(palabra => {
        const paddingLimite = window.innerWidth < 576 ? 30 : 280;
        const limite = window.innerWidth - paddingLimite;
        if (x + palabra.length * metricas.spacing > limite) { 
          x = window.innerWidth < 576 ? 15 : 80; 
          y += metricas.lineGap; 
        }
        palabra.split('').forEach(char => {
          motor.letras.push({ char, x, y, activo: true, ancho: ctx.measureText(char).width });
          x += metricas.spacing;
        });
        x += metricas.spacing;
      });
    }

    const manejarInput = (e) => {
      motor.teclas[e.key.toLowerCase()] = e.type === 'keydown';
      if (e.key === 'Escape') setJuegoIniciado(false);
    };
    window.addEventListener('keydown', manejarInput);
    window.addEventListener('keyup', manejarInput);

    let idAnimacion;
    const bucle = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const metricas = obtenerMetricasPantalla();

      if (motor.juegoIniciado) {
        if ((motor.teclas['arrowleft'] || motor.teclas['touchleft']) && motor.posicionTanqueX > 10) {
          motor.posicionTanqueX -= metricas.tankSpeed;
        }
        if ((motor.teclas['arrowright'] || motor.teclas['touchright']) && motor.posicionTanqueX < canvas.width - 65) {
          motor.posicionTanqueX += metricas.tankSpeed;
        }
        if ((motor.teclas['w'] || motor.teclas['touchfire']) && Date.now() - motor.ultimoDisparo > 150) {
          motor.proyectiles.push({ x: motor.posicionTanqueX + 25, y: canvas.height - 60 });
          motor.ultimoDisparo = Date.now();
        }
      }

      ctx.font = `bold ${metricas.fontSize}px monospace`;
      motor.letras.forEach(l => {
        if (l.activo) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(l.char, l.x, l.y);
        }
      });

      ctx.fillStyle = '#FF5722';
      motor.proyectiles.forEach((p, iP) => {
        p.y -= 12;
        ctx.fillRect(p.x, p.y, 4, 15);
        motor.letras.forEach(l => {
          if (l.activo && p.x > l.x && p.x < l.x + l.ancho && p.y < l.y && p.y > l.y - 25) {
            l.activo = false;
            motor.proyectiles.splice(iP, 1);
            setPuntaje(prev => prev + 1);
            for (let i = 0; i < 2; i++) {
              motor.fragmentos.push({
                char: l.char, x: l.x, y: l.y,
                vx: (motor.posicionTanqueX - l.x) / 80 + (Math.random() - 0.5) * 3,
                vy: Math.random() * 2 + 2, rot: 0
              });
            }
          }
        });
        if (p.y < 0) motor.proyectiles.splice(iP, 1);
      });

      motor.fragmentos.forEach((f, iF) => {
        f.x += f.vx; f.y += f.vy; f.vy += 0.1; f.rot += 0.1;
        if (f.y > canvas.height - 50 && f.x > motor.posicionTanqueX && f.x < motor.posicionTanqueX + 55) {
          setVida(v => {
            const nueva = Math.max(0, v - 5);
            if (nueva <= 0) setJuegoIniciado(false);
            return nueva;
          });
          motor.estaSiendoGolpeado = true;
          setTimeout(() => { motor.estaSiendoGolpeado = false; }, 100);
          for (let i = 0; i < 10; i++) {
            motor.chispas.push({
              x: f.x, y: f.y,
              vx: (Math.random() - 0.5) * 12,
              vy: (Math.random() - 1) * 6,
              vida: 1.0
            });
          }
          motor.fragmentos.splice(iF, 1);
        }
        ctx.save();
        ctx.translate(f.x, f.y); ctx.rotate(f.rot);
        ctx.fillStyle = '#FFB74D';
        ctx.fillText(f.char, 0, 0);
        ctx.restore();
        if (f.y > canvas.height) motor.fragmentos.splice(iF, 1);
      });

      motor.chispas.forEach((c, iC) => {
        c.x += c.vx; c.y += c.vy; c.vida -= 0.04;
        ctx.fillStyle = `rgba(255, 255, 255, ${c.vida})`;
        ctx.fillRect(c.x, c.y, 3, 3);
        if (c.vida <= 0) motor.chispas.splice(iC, 1);
      });

      const vibracion = motor.estaSiendoGolpeado ? (Math.random() - 0.5) * 8 : 0;
      ctx.fillStyle = motor.estaSiendoGolpeado ? '#FFFFFF' : '#FF5722';
      ctx.fillRect(motor.posicionTanqueX + vibracion, canvas.height - 40, 55, 25);
      ctx.fillStyle = motor.estaSiendoGolpeado ? '#FF0000' : '#FFB74D';
      ctx.fillRect(motor.posicionTanqueX + 22 + vibracion, canvas.height - 55, 12, 18);
      ctx.fillStyle = '#000';
      ctx.fillRect(motor.posicionTanqueX + vibracion, canvas.height - 20, 55, 6);

      idAnimacion = requestAnimationFrame(bucle);
    };

    idAnimacion = requestAnimationFrame(bucle);
    return () => {
      cancelAnimationFrame(idAnimacion);
      window.removeEventListener('resize', ajustarTamaño);
      window.removeEventListener('keydown', manejarInput);
      window.removeEventListener('keyup', manejarInput);
    };
  }, []); 

  return (
    <Container fluid className="p-0 m-0 d-flex flex-column" style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%' }}>
      <style>
        {`
          @font-face { font-family: 'Super Bubble'; src: url('/fonts/Super Bubble.ttf') format('truetype'); }
          @keyframes icon-bounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.2); } }
          .icon-animated { display: inline-block; animation: icon-bounce 0.6s ease infinite; }
          .btn-level { transition: all 0.3s ease; height: 85px; }
          .texto-bubble { font-family: 'Super Bubble', cursive !important; }

          /* --- ESTILOS REDES SOCIALES --- */
          .social-container {
            margin-top: 40px;
            padding: 20px 40px;
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .social-title {
            font-size: 0.7rem;
            color: var(--abrl-naranja);
            font-weight: 800;
            letter-spacing: 3px;
            margin-bottom: 15px;
            text-transform: uppercase;
            opacity: 0.9;
          }
          .social-icons-wrapper {
            display: flex;
            gap: 30px;
            justify-content: center;
          }
          .social-icon-img {
            width: 42px;
            height: 42px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(343deg) brightness(101%) contrast(101%);
          }
          .social-link:hover .social-icon-img {
            transform: translateY(-8px) scale(1.2);
            filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(343deg) brightness(120%) contrast(110%) drop-shadow(0 0 10px rgba(255, 87, 34, 0.6));
          }

          /* CONTROLES MULTITOUCH PARA SMARTPHONES/TABLETS */
          .mobile-ctrl-zone {
            display: none;
            position: absolute;
            bottom: 25px;
            width: 100%;
            padding: 0 20px;
            z-index: 100;
            user-select: none;
          }
          .btn-touch-pad {
            width: 65px;
            height: 65px;
            background: rgba(30, 41, 59, 0.7) !important;
            border: 2px solid rgba(255,255,255,0.1) !important;
            color: white !important;
            border-radius: 50% !important;
            font-size: 1.5rem !important;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          }
          .btn-touch-fire {
            width: 75px;
            height: 75px;
            background: rgba(255, 87, 34, 0.8) !important;
            border: 2px solid var(--abrl-naranja) !important;
            font-size: 1.8rem !important;
          }

          @media (max-width: 991px) {
            .mobile-ctrl-zone { display: flex; }
            .instrucciones-desktop-box { display: none !important; }
          }

          @media (min-width: 1920px) {
            .social-container { max-width: 600px; margin: 40px auto 0 auto; }
          }
        `}
      </style>

      <div ref={contenedorRef} className="overflow-hidden position-relative flex-grow-1" 
           style={{ width: '100%', backgroundColor: '#0f172a', border: 'none', minHeight: '500px' }}>
        
        {/* HUD DE ESTADÍSTICAS E INSTRUCCIONES */}
        {juegoIniciado && (
          <div className="position-absolute top-0 w-100 d-flex justify-content-between align-items-start p-3" style={{ zIndex: 11 }}>
            <div className="bg-dark border border-secondary rounded p-2 d-flex align-items-center gap-3 shadow-lg" style={{ minWidth: '240px' }}>
              <div className="text-center">
                <span className="text-danger small fw-bold d-block" style={{ fontSize: '0.6rem' }}>INTEGRIDAD</span>
                <span className="text-white fs-3 fw-bold">{vida}</span>
              </div>
              <div className="flex-grow-1">
                <ProgressBar now={vida} variant={vida > 40 ? "success" : "danger"} style={{ height: '10px' }} animated={vida < 30} />
              </div>
            </div>
            
            <div className="text-center mt-2 instrucciones-desktop-box animate__animated animate__fadeIn" style={{ flex: 1 }}>
                <div className="px-3 py-1 rounded-pill" style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
                    <span className="text-white-50 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                        MOVER: <span className="text-white">← →</span> | 
                        DISPARAR: <span className="text-white">W</span> | 
                        SALIR: <span className="text-white">ESC</span>
                    </span>
                </div>
            </div>

            <div className="bg-dark border border-secondary rounded px-4 py-2 shadow-lg text-center">
              <span className="text-secondary small fw-bold d-block" style={{ fontSize: '0.65rem' }}>PUNTAJE</span>
              <div className="text-white fs-3 fw-mono">
                <span style={{ color: 'var(--abrl-naranja)' }}>{puntaje}</span>
                <span className="text-muted small"> / {totalLetras}</span>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLES VIRTUALES EXCLUSIVOS PARA SMARTPHONES Y TABLETAS */}
        {juegoIniciado && (
          <div className="mobile-ctrl-zone justify-content-between align-items-center">
            <div className="d-flex gap-3">
              <Button 
                className="btn-touch-pad"
                onTouchStart={() => { motorRef.current.teclas['touchleft'] = true; }}
                onTouchEnd={() => { motorRef.current.teclas['touchleft'] = false; }}
              >←</Button>
              <Button 
                className="btn-touch-pad"
                onTouchStart={() => { motorRef.current.teclas['touchright'] = true; }}
                onTouchEnd={() => { motorRef.current.teclas['touchright'] = false; }}
              >→</Button>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Button 
                className="btn-touch-pad btn-touch-fire"
                onTouchStart={() => { motorRef.current.teclas['touchfire'] = true; }}
                onTouchEnd={() => { motorRef.current.teclas['touchfire'] = false; }}
              >🚀</Button>
              <Button 
                variant="danger" 
                style={{ borderRadius: '10px', fontWeight: 'bold', fontSize: '0.75rem', height: '45px' }}
                onClick={() => setJuegoIniciado(false)}
              >SALIR</Button>
            </div>
          </div>
        )}

        {!juegoIniciado && (
          <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center px-4 text-center" 
               style={{ zIndex: 10, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)' }}>
            
            <h1 className="text-white mb-3 fw-bold display-4">
              CARÁTULAS IA: <span style={{color:'var(--abrl-naranja)'}}>ABRLVERSO</span>
            </h1>

            <p className="text-white mb-4 lh-lg" style={{ maxWidth: '800px', fontSize: '1.2rem' }}>
              {vida <= 0 ? "⚠️ SISTEMA COLAPSADO: El núcleo ha sido destruido." : "Limpia el mensaje para desbloquear el generador masivo de carátulas."}
            </p>
            
            <div className="d-flex flex-column align-items-center">
                <Button className="btn-abrl btn-lg px-5 py-3 shadow-lg fw-bold" 
                        onClick={() => { setVida(100); setPuntaje(0); setJuegoIniciado(true); motorRef.current.fragmentos = []; motorRef.current.proyectiles = []; }}>
                    {vida <= 0 ? "REPARAR NÚCLEO 🛠️" : "DESTRUIR Y ENTRAR 🚀"}
                </Button>

                {/* --- SECCIÓN DE REDES SOCIALES UNIFICADA --- */}
                <div className="social-container animate__animated animate__fadeInUp animate__delay-1s">
                    <span className="social-title">SÍGUENOS EN NUESTRO UNIVERSO</span>
                    <div className="social-icons-wrapper">
                        {/* TikTok */}
                        <a href="https://www.tiktok.com/@abrlverso" target="_blank" rel="noreferrer" className="social-link">
                            <img src="/iconosRedes/tiktok.svg" alt="TikTok" className="social-icon-img" />
                        </a>
                        {/* Facebook */}
                        <a href="https://www.facebook.com/profile.php?id=61576624422734&locale=es_LA" target="_blank" rel="noreferrer" className="social-link">
                            <img src="/iconosRedes/facebook.svg" alt="Facebook" className="social-icon-img" />
                        </a>
                        {/* Instagram */}
                        <a href="https://www.instagram.com/abrilversomegacaratulasoficial/" target="_blank" rel="noreferrer" className="social-link">
                            <img src="/iconosRedes/instagram.svg" alt="Instagram" className="social-icon-img" />
                        </a>
                    </div>
                </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    </Container>
  );
};

export default PaginaInicio;