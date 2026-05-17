import { useEffect } from 'react';

const useSeguridadAbrl = () => {
  useEffect(() => {
    /**
     * 💡 CONDICIÓN DE DESARROLLO:
     * Si el proyecto se ejecuta en localhost, se omite el bloqueo para permitir
     * la inspección de red, consola y depuración del servidor.
     */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return; 
    }

    // 1. Bloquear Clic Derecho (Evita "Guardar imagen como")
    const bloquearMenu = (e) => e.preventDefault();

    // 2. Bloquear atajos de teclado comunes (F12, Ctrl+Shift+I, Ctrl+U)
    const bloquearTeclas = (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', bloquearMenu);
    document.addEventListener('keydown', bloquearTeclas);

    // Limpieza de eventos al desmontar el componente
    return () => {
      document.removeEventListener('contextmenu', bloquearMenu);
      document.removeEventListener('keydown', bloquearTeclas);
    };
  }, []);
};

export default useSeguridadAbrl;