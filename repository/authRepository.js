import db from '../config/database.js';

class AuthRepository {
    
    // Buscar usuario por Email
    static async getUserByEmail(email) {
        const query = 'SELECT * FROM USUARIO WHERE email = ?';
        const rows = await db.query(query, [email]);
        return rows[0];
    }

    // Crear nuevo usuario
    static async createUser({ nombre, email, password, tel, direccion = '' }) {
        const query = `
            INSERT INTO USUARIO (nombre, email, contrasena, telefono, direccion, rol, activo) 
            VALUES (?, ?, ?, ?, ?, 'cliente', 1)
        `;
        // Ejecutamos el insert
        const result = await db.query(query, [nombre, email, password, tel || '', direccion]);
        
        // Devolvemos el objeto creado (simulando lo que espera tu controlador)
        return {
            ID: result.insertId,
            NOMBRE: nombre,
            EMAIL: email,
            ROL: 'cliente',
            ACTIVO: 1,
            PHOTO_URL: ''
        };
    }

    // Buscar por ID
    static async getUserById(id) {
        const query = 'SELECT * FROM USUARIO WHERE id = ?';
        const rows = await db.query(query, [id]);
        return rows[0];
    }
}

export default AuthRepository;