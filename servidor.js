import express from 'express';
import cors from 'cors';
import rutasCaratulas from './rutas/caratulas.js';
import pool from './config/bd.js'; 
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp'; 
import { fileURLToPath } from 'url';

// Configuración para obtener __dirname en entornos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 5000;

// --- CONFIGURACIÓN DE CORS MAESTRO ---
app.use(cors({
  origin: true, 
  methods: ["GET", "POST"],
  credentials: true,
  exposedHeaders: ['Content-Disposition'] 
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] 🛰️  Petición: ${req.method} ${req.url}`);
  next();
});

// ============================================================
// FUNCIÓN AUXILIAR: DIVIDIR TÍTULO EN 3 FILAS
// ============================================================
const dividirEnLineas = (texto) => {
    const palabras = texto.toUpperCase().split(" ");
    if (palabras.length <= 1) return [texto.toUpperCase()];
    if (palabras.length === 2) return [palabras[0], palabras[1]];
    return [
        palabras.slice(0, Math.ceil(palabras.length / 3)).join(" "),
        palabras.slice(Math.ceil(palabras.length / 3), Math.ceil(2 * palabras.length / 3)).join(" "),
        palabras.slice(Math.ceil(2 * palabras.length / 3)).join(" ")
    ];
};

// ============================================================
// RUTA DE SEGURIDAD: VERIFICAR Y QUEMAR CÓDIGO
// ============================================================
app.post('/api/verificar-codigo', async (req, res) => {
    const { codigo } = req.body;
    try {
        const [filas] = await pool.query('SELECT * FROM CODIGOS_ACCESO WHERE CODIGO = ? AND USADO = 0', [codigo]);
        
        if (filas.length > 0) {
            await pool.query('UPDATE CODIGOS_ACCESO SET USADO = 1, FECHA_USO = NOW() WHERE CODIGO = ?', [codigo]);
            res.json({ valido: true, mensaje: 'Código verificado.' });
        } else {
            res.status(400).json({ valido: false, mensaje: 'Código inválido.' });
        }
    } catch (error) {
        res.status(500).json({ valido: false });
    }
});

// ============================================================
// ENDPOINT MASTER: DESCARGA ZIP GENERAL (TODO EN SUPER BUBBLE)
// ============================================================
app.get('/api/descargar-pack/:idPais/:nivel', async (req, res) => {
    const { idPais, nivel } = req.params;
    try {
        const [infoPais] = await pool.query('SELECT NOMBRE_PAIS FROM paises_base WHERE ID_PAIS = ?', [idPais]);
        const nombrePaisStr = infoPais.length > 0 ? infoPais[0].NOMBRE_PAIS : idPais;

        const [filas] = await pool.query(
            `SELECT M.NOMBRE_MATERIA, R.RUTA_ARCHIVO FROM materias_sistema M
             JOIN recursos_arte R ON M.ID_MATERIA = R.ID_MATERIA
             WHERE M.ID_PAIS = ? AND M.NIVEL_EDUCATIVO = ?`, [idPais, nivel]
        );

        if (filas.length === 0) return res.status(404).send("Paquete no encontrado.");

        const fSuperBubbleBase64 = fs.readFileSync(path.join(__dirname, 'public', 'fonts', 'Super Bubble.ttf')).toString('base64');

        res.attachment(`${nombrePaisStr}-${nivel}_AbrlVerso.zip`);
        const archivoZip = archiver('zip', { zlib: { level: 9 } });
        archivoZip.pipe(res);

        for (const fila of filas) {
            const rutaAbsoluta = path.join(__dirname, 'public', fila.RUTA_ARCHIVO);
            if (fs.existsSync(rutaAbsoluta)) {
                const imagenBase = sharp(rutaAbsoluta);
                const { width, height } = await imagenBase.metadata();
                
                const lineas = dividirEnLineas(fila.NOMBRE_MATERIA);
                const maxChars = Math.max(...lineas.map(l => l.length));
                const fontSize = Math.min(Math.floor((width * 0.90) / (maxChars * 0.65)), 145);

                const svgTexto = `
                <svg width="${width}" height="${height}">
                    <defs>
                        <style>
                            @font-face { font-family: 'Super Bubble'; src: url('data:font/ttf;base64,${fSuperBubbleBase64}') format('truetype'); }
                            .t { fill: white; font-family: 'Super Bubble'; font-size: ${fontSize}px; stroke: #1c2841; stroke-width: 14px; paint-order: stroke fill; font-weight: bold; }
                        </style>
                    </defs>
                    <text x="50%" y="${fontSize + 20}" text-anchor="middle" class="t">
                        ${lineas.map((l, i) => `<tspan x="50%" dy="${i === 0 ? '0' : '1.05em'}">${l}</tspan>`).join('')}
                    </text>
                </svg>`;

                const buffer = await imagenBase.composite([{ input: Buffer.from(svgTexto), top: 0, left: 0 }]).webp({ quality: 100 }).toBuffer();
                archivoZip.append(buffer, { name: `${fila.NOMBRE_MATERIA}.webp` });
            }
        }
        await archivoZip.finalize();
    } catch (e) { res.status(500).send("Error en Pack General"); }
});

// ============================================================
// ENDPOINT PRO: TÍTULO, ETIQUETAS Y DATOS EN SUPER BUBBLE
// ============================================================
app.post('/api/descargar-pack-pro', async (req, res) => {
    const { idPais, nivel, nombre, grado } = req.body;
    try {
        const [infoPais] = await pool.query('SELECT NOMBRE_PAIS FROM paises_base WHERE ID_PAIS = ?', [idPais]);
        const nombrePaisStr = infoPais.length > 0 ? infoPais[0].NOMBRE_PAIS : "Pais";

        const [filas] = await pool.query(
            `SELECT M.NOMBRE_MATERIA, R.RUTA_ARCHIVO FROM materias_sistema M
             JOIN recursos_arte R ON M.ID_MATERIA = R.ID_MATERIA
             WHERE M.ID_PAIS = ? AND M.NIVEL_EDUCATIVO = ?`, [idPais, nivel]
        );

        if (filas.length === 0) return res.status(404).send("Paquete no encontrado.");

        const fSuperBubbleBase64 = fs.readFileSync(path.join(__dirname, 'public', 'fonts', 'Super Bubble.ttf')).toString('base64');

        res.attachment(`${nombrePaisStr}-${nivel}_PROAbrilVerso.zip`);
        const archivoZip = archiver('zip', { zlib: { level: 9 } });
        archivoZip.pipe(res);

        for (const fila of filas) {
            const rutaAbsoluta = path.join(__dirname, 'public', fila.RUTA_ARCHIVO);
            if (fs.existsSync(rutaAbsoluta)) {
                const imagenBase = sharp(rutaAbsoluta);
                const { width, height } = await imagenBase.metadata();

                const lineas = dividirEnLineas(fila.NOMBRE_MATERIA);
                const maxChars = Math.max(...lineas.map(l => l.length));
                const fontSizeT = Math.min(Math.floor((width * 0.90) / (maxChars * 0.65)), 145);

                const fontSizeE = Math.min(Math.floor((width * 0.85) / (Math.max(nombre.length, 10) * 0.65)), 85);
                const fontSizeG = Math.min(Math.floor((width * 0.85) / (Math.max(grado.length, 10) * 0.65)), 80);

                const svgOverlay = `
                <svg width="${width}" height="${height}">
                    <defs>
                        <style>
                            @font-face { font-family: 'Super Bubble'; src: url('data:font/ttf;base64,${fSuperBubbleBase64}') format('truetype'); }
                            .base-f { font-family: 'Super Bubble'; font-weight: bold; }
                            .titulo { fill: white; font-size: ${fontSizeT}px; stroke: #1c2841; stroke-width: 14px; paint-order: stroke fill; }
                            .label { fill: #ff5722; font-size: 32px; stroke: white; stroke-width: 6px; paint-order: stroke fill; }
                            .valor { fill: white; font-size: ${fontSizeE}px; stroke: #1c2841; stroke-width: 10px; paint-order: stroke fill; }
                            .valor-g { fill: white; font-size: ${fontSizeG}px; stroke: #1c2841; stroke-width: 10px; paint-order: stroke fill; }
                        </style>
                    </defs>
                    <text x="50%" y="${fontSizeT + 15}" text-anchor="middle" class="base-f titulo">
                        ${lineas.map((l, i) => `<tspan x="50%" dy="${i === 0 ? '0' : '1.1em'}">${l}</tspan>`).join('')}
                    </text>
                    <text x="80" y="${height - 230}" class="base-f label">ESTUDIANTE:</text>
                    <text x="80" y="${height - 150}" class="base-f valor">${nombre.toUpperCase()}</text>
                    <text x="80" y="${height - 95}" class="base-f label">CURSO / GRADO:</text>
                    <text x="80" y="${height - 25}" class="base-f valor-g">${grado.toUpperCase()}</text>
                </svg>`;

                const buffer = await imagenBase.composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }]).webp({ quality: 100 }).toBuffer();
                archivoZip.append(buffer, { name: `${fila.NOMBRE_MATERIA}.webp` });
            }
        }
        await archivoZip.finalize();
    } catch (e) { res.status(500).send("Error en Pack PRO"); }
});

app.use('/api', rutasCaratulas);

app.use((err, req, res, next) => {
  console.error('❌ ERROR CRÍTICO EN EL SERVIDOR:', err.stack);
  res.status(500).json({ mensaje: "Error interno en el servidor" });
});

app.listen(PUERTO, () => {
  console.log('----------------------------------------------------');
  console.log(`🚀 SERVIDOR LISTO: http://localhost:${PUERTO}`);
  console.log(`💻 ESPERANDO CONEXIÓN DEL FRONTEND (VITE)...`);
  console.log('----------------------------------------------------');
});