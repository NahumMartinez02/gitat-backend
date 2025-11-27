const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar la configuración de la base de datos (la crearemos en el siguiente paso si no la tienes)
const pool = require('./config/database');

// Inicializar la aplicación de Express
const app = express();

// --- 1. Middlewares (Configuración de Seguridad y Utilidades) ---
app.use(helmet());                          // Protege cabeceras HTTP
app.use(cors());                            // Permite conexiones desde otros dominios (tu frontend)
app.use(morgan('dev'));                     // Muestra logs de las peticiones en la consola
app.use(express.json());                    // Permite recibir datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Permite recibir datos de formularios

// --- 2. Ruta de Prueba (Health Check) ---
// Esta ruta sirve para ver si el servidor responde y si la BD está conectada
app.get('/api/health', async (req, res) => {
    try {
        // Consulta simple para verificar conexión a MySQL
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json({ 
            estado: 'OK', 
            mensaje: 'Servidor Backend Gitat funcionando al 100%', 
            base_datos: rows[0].result === 2 ? 'Conectada 🟢' : 'Error 🔴' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            estado: 'Error', 
            mensaje: 'No hay conexión con la base de datos',
            detalle: error.message 
        });
    }
});

// --- 3. Rutas de la API (Aquí iremos agregando tus Features) ---
// Por ahora están comentadas hasta que creemos los archivos de rutas
// app.use('/api/auth', require('./Features/Auth/authRoutes'));
// app.use('/api/users', require('./Features/Admin/adminRoutes'));


// --- 4. Manejo de Errores Global ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal en el servidor!');
});

// --- 5. Arrancar el Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`------------------------------------------------`);
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`------------------------------------------------`);
});