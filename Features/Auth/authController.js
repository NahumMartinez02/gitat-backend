const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('../../repository/authRepository');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password, telefono, direccion } = req.body;

        // 1. Validar campos
        if (!nombre || !email || !password) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios' });
        }

        // 2. Verificar si ya existe
        const existingUser = await AuthRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        // 3. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Guardar en BD
        const userId = await AuthRepository.createUser({
            nombre, email, passwordHash, telefono, direccion
        });

        res.status(201).json({ msg: 'Usuario registrado exitosamente', userId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al registrar' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const user = await AuthRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // 2. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // 3. Generar JWT
        const payload = {
            id: user.id,
            rol: user.rol,
            nombre: user.nombre
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({
            msg: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al loguear' });
    }
};