const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno (.env)

const app = express();

// --- 1. CONFIGURACIONES GENERALES ---
// Permitir JSON en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS (Aunque estando en el mismo dominio no es estricto, es buena práctica)
app.use(cors());

// --- 2. RUTAS DE LA API (TU BACKEND) ---
// Aquí importas tus rutas reales. Ejemplo:
// const usuariosRoutes = require('./routes/usuarios');
// app.use('/api/usuarios', usuariosRoutes);

// RUTA DE PRUEBA: Para ver si el backend responde
app.get('/api/status', (req, res) => {
    res.json({ 
        mensaje: 'Servidor Backend Operativo 🚀', 
        entorno: process.env.NODE_ENV,
        fecha: new Date()
    });
});

// --- 3. SERVIR EL FRONTEND (REACT) ---
// IMPORTANTE: Asegúrate de que la carpeta 'build' de React esté dentro de tu carpeta del backend
// O ajusta la ruta path.join(__dirname, 'client/build') según tu estructura.

const buildPath = path.join(__dirname, 'build'); // Asumiendo que copiaste la carpeta 'build' aquí

// Servir archivos estáticos (css, js, imágenes de React)
app.use(express.static(buildPath));

// --- 4. MANEJO DEL "CLIENT-SIDE ROUTING" ---
// Si alguien entra a ti.losifra.com/inventario, Express no encontrará esa carpeta.
// Con esto, le decimos: "Si no es una API, mándale el index.html de React y que React resuelva".
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// --- 5. INICIAR SERVIDOR ---
// Plesk asigna el puerto automáticamente en process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
});