import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/database.js";

// Rutas (Descomenta conforme vayamos creando los archivos)
import authRoutes from "./Features/Auth/authRoutes.js";
// import authorizationRoutes from "./Features/Authorization/authorizationRoutes.js";
// import adminRoutes from "./Features/Admin/adminRoutes.js";
// import inventoryRoutes from './Features/Inventory/inventoryRoutes.js';
// import reservationRoutes from './Features/Reservations/reservationRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json()); 
app.use(cookieParser());

// Configuración CORS (Ajustada para producción y local)
app.use(
  cors({
    origin: [
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://gitat.grupolosifra.com" // Tu dominio real
    ],
    credentials: true,
  })
);

// Verificación de Base de Datos
async function testDbConnection() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error.message);
    // No matamos el proceso, para que al menos el servidor responda errores HTTP
  }
}

// Endpoint de Salud (Health Check)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', msg: 'Backend GITAT Activo 🚀' });
});

async function startServer() {
  await testDbConnection(); 

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });

  // Rutas
  app.use("/api/auth", authRoutes); 
  
  // Descomentar cuando tengamos los archivos listos:
  // app.use("/api/verification", authorizationRoutes);
  // app.use("/api/admin", adminRoutes);
  // app.use("/api/inventory", inventoryRoutes);
  // app.use('/api/reservation', reservationRoutes);
}

startServer();