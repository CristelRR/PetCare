import { Router } from "express";
import { register, login, verifyOtp } from "../controllers/authController";

const router = Router();

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un usuario nuevo en la base de datos con correo y contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Usuario ya existe o datos inválidos
 */
router.post("/register", register);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     description: Valida credenciales del usuario y envía un código OTP al correo.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Código OTP enviado al correo
 *       400:
 *         description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @openapi
 * /verify-otp:
 *   post:
 *     summary: Verificar código OTP y generar token JWT
 *     description: Verifica el OTP enviado al correo y devuelve el token de acceso JWT.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Token JWT generado correctamente
 *       400:
 *         description: Código incorrecto o expirado
 */
router.post("/verify-otp", verifyOtp);

export default router;
