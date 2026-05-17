/* ============================================================
   UTILIDAD DE SEGURIDAD: LIMPIADOR DE ENTRADAS
   ============================================================ */

/**
 * Limpia el texto para evitar inyección de scripts básicos
 * @param {string} textoSucio 
 * @returns {string} textoLimpio
 */
export const sanitizarEntrada = (textoSucio) => {
  if (!textoSucio) return '';
  return textoSucio
    .replace(/[<>]/g, '') // Elimina etiquetas HTML
    .trim()
    .substring(0, 100); // Límite razonable de caracteres
};

/* ---------------- FIN DEL LIMPIADOR ---------------- */