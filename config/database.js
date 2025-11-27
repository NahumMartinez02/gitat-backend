const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración del Pool de conexiones (Más eficiente que una sola conexión)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Cuántas conexiones simultáneas permitimos
    queueLimit: 0
});

// Prueba de conexión al cargar el archivo (solo para verificar en consola)
pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('✅ Base de Datos conectada exitosamente');
    })
    .catch(err => {
        console.error('❌ Error conectando a la Base de Datos:', err.code);
        console.error('   -> Revisa tu archivo .env y las credenciales.');
    });

module.exports = pool;