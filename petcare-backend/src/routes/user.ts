import { Router } from "express";
import User from "../models/User";

const router = Router();

/**
 * @openapi
 * /users/all:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista de todos los usuarios registrados. No requiere autenticación.
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *       500:
 *         description: Error al obtener usuarios.
 */
router.get("/users/all", async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

/**
 * @openapi
 * /users/delete:
 *   delete:
 *     summary: Eliminar usuario por correo electrónico
 *     description: Elimina un usuario enviando su email en el cuerpo de la solicitud (JSON). No requiere autenticación.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/users/delete", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El campo 'email' es obligatorio" });
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: `Usuario con email ${email} eliminado correctamente` });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

/**
 * @openapi
 * /users/update:
 *   put:
 *     summary: Actualizar usuario por correo electrónico
 *     description: Actualiza datos de un usuario existente usando su email. No requiere autenticación.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@correo.com
 *               name:
 *                 type: string
 *                 example: "Nuevo nombre"
 *               phone:
 *                 type: string
 *                 example: "5551234567"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al actualizar usuario.
 */
router.put("/users/update", async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El campo 'email' es obligatorio" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

/**
 * @openapi
 * /users/find:
 *   post:
 *     summary: Buscar un usuario por correo electrónico
 *     description: Retorna la información de un usuario existente enviando su email en formato JSON. No requiere autenticación.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Información del usuario obtenida correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/users/find", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El campo 'email' es obligatorio" });
    }

    const user = await User.findOne({ email }).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar usuario" });
  }
});

export default router;
