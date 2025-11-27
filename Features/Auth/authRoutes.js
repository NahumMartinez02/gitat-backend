import express from 'express';
import authController from './authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas futuras (comentadas hasta que implementes la lógica completa)
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

export default router;