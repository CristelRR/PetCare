import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto123";

// Configuración nodemailer con SMTP desde .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true si es 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Registro normal
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Login → genera OTP y lo envía por correo
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Cuerpo recibido en /login:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }

  try {
    const user = await User.findOne({ email }); // <-- declara user aquí
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Enviar OTP
    console.log("Enviando OTP por correo a:", user.email);
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: "Código de verificación (MiApp)",
      text: `Tu código OTP es: ${otp}`,
    });

    res.json({ message: "Código OTP enviado al correo" });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};


// Verificar OTP → devolver token JWT
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email y código OTP son obligatorios" });
  }

  try {
    console.log("Cuerpo recibido en verifyOtp:", req.body); // 🔍 debug

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    console.log("Usuario encontrado:", user.email, "OTP guardado:", user.otp); // 🔍 debug

    if (user.otp !== otp) return res.status(400).json({ message: "Código incorrecto" });
    if (user.otpExpires && user.otpExpires < new Date())
      return res.status(400).json({ message: "Código expirado" });

    // Limpiar OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, firstLogin: user.firstLogin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al verificar OTP" });
  }
};

