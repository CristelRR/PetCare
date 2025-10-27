import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET!;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// Registro
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Usuario ya existe" });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar y guardar OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: "Código OTP - PetCareApp",
      text: `Tu código OTP es: ${otp}`,
    });

    res.json({ message: "Código OTP enviado al correo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// Verificación OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Código incorrecto" });
    if (user.otpExpires && user.otpExpires < new Date())
      return res.status(400).json({ message: "Código expirado" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        firstLogin: user.firstLogin, // ✅ incluir esta propiedad
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar OTP" });
  }
};


//Eliminar por ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};