import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables del archivo .env
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306, // <--- Añadido para soportar DB_PORT dentro de Docker
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CARATULAS_SISTEMA',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportación por defecto obligatoria para ES Modules
export default pool;