import { Router } from 'express';
import { userModel } from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

// 1. REGISTRO
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password) // Encriptamos aquí
        };

        const result = await userModel.create(user);
        res.send({ status: "success", message: "Usuario registrado", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// 2. LOGIN (Genera el Token)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send({ status: "error", error: "Usuario no encontrado" });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Contraseña incorrecta" });

        // Creamos el token con info esencial (sin la contraseña!)
        const token = jwt.sign({ 
            id: user._id, 
            first_name: user.first_name, 
            email: user.email, 
            role: user.role 
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Guardamos el token en una cookie "httpOnly" por seguridad
        res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, maxAge: 60*60*24*1000 })
           .send({ status: "success", message: "Login exitoso" });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// 3. CURRENT (Valida el JWT)
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    // Si llegó hasta aquí, es porque el token es válido
    // Los datos del usuario están en req.user gracias a Passport
    res.send({ status: "success", payload: req.user });
});

export default router;