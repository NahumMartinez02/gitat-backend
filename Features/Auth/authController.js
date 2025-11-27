import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
// import { transporter } from "../../config/mailMan.js"; // Descomenta cuando tengas el mailMan
import authRepository from "../../repository/authRepository.js";

// Función Register
const register = async (req, res) => {
    const { nombre, email, tel, password } = req.body;
    
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Verificar duplicados antes de insertar
        const existing = await authRepository.getUserByEmail(email);
        if(existing) return res.status(400).json({ message: 'El correo ya existe' });

        // Encriptar con BCRYPT (Mejor que SHA256)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const user = await authRepository.createUser({ 
            nombre, email, password: hashedPassword, tel 
        });

        /* AQUÍ IRÍA EL ENVÍO DE CORREO (Comentado para evitar errores por ahora)
        await transporter.sendMail({...});
        */

        const payload = {
            id: user.ID,
            nombre: user.NOMBRE,
            rol: user.ROL
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            })
            .status(201)
            .json({ message: "Registro exitoso", userId: user.ID });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// Función Login
const login = async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password){
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
        const user = await authRepository.getUserByEmail(email);
        
        // Validar usuario y contraseña (usando bcrypt.compare)
        if(!user || !(await bcrypt.compare(password, user.contrasena))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const payload = {
            id: user.id, // Ojo: minúscula porque viene directo de BD
            nombre: user.nombre,
            rol: user.rol,
            photo_url: user.photo_url
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        return res
        .cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 3600000
        })
        .json({ message: "Login exitoso", token, user: payload });

    } catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export default { register, login };