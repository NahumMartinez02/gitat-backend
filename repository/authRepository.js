const pool = require('../config/database');

class AuthRepository {
    
    // Buscar usuario por Email
    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM USUARIO WHERE email = ?', [email]);
        return rows[0];
    }

    // Crear nuevo usuario (Cliente por defecto)
    static async createUser(userData) {
        const { nombre, email, passwordHash, telefono, direccion } = userData;
        const [result] = await pool.query(
            `INSERT INTO USUARIO (nombre, email, contrasena, telefono, direccion, rol, activo) 
             VALUES (?, ?, ?, ?, ?, 'cliente', 1)`,
            [nombre, email, passwordHash, telefono, direccion]
        );
        return result.insertId;
    }

    // Obtener usuario por ID (sin contraseña)
    static async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, nombre, email, telefono, direccion, rol, photo_url FROM USUARIO WHERE id = ?', 
            [id]
        );
        return rows[0];
    }
}

module.exports = AuthRepository;