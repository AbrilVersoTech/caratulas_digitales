import express from 'express';
import bd from '../config/bd.js'; // Importamos el pool como 'bd'

const router = express.Router();

// Obtener todos los países
router.get('/paises', async (req, res) => {
  try {
    const [filas] = await bd.query('SELECT * FROM PAISES_BASE');
    res.json(filas);
  } catch (error) {
    console.error("Error en BD:", error);
    res.status(500).json({ mensaje: "Error al obtener países", error });
  }
});

// Obtener materias por país y nivel
router.get('/materias/:idPais/:nivel', async (req, res) => {
  const { idPais, nivel } = req.params;
  try {
    const [filas] = await bd.query(
      'SELECT * FROM MATERIAS_SISTEMA WHERE ID_PAIS = ? AND NIVEL_EDUCATIVO = ?',
      [idPais, nivel]
    );
    res.json(filas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener materias", error });
  }
});

// --- NUEVA RUTA: PUNTO 2 ---
// Obtener la imagen de arte IA para una materia específica
router.get('/recurso/:idMateria', async (req, res) => {
  const { idMateria } = req.params;
  try {
    const [filas] = await bd.query(
      'SELECT RUTA_ARCHIVO FROM RECURSOS_ARTE WHERE ID_MATERIA = ? LIMIT 1',
      [idMateria]
    );
    // Si no hay registro, devolvemos null para que el frontend maneje el placeholder
    res.json(filas[0] || { RUTA_ARCHIVO: null });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener arte", error });
  }
});

export default router;