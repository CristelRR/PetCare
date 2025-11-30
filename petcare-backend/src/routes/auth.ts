import { Router } from "express";
import {
  register,
  login,
  verifyOtp,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "../controllers/authController";

const router = Router();

/* AUTENTICACIÓN */
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);

/* RECUPERAR CONTRASEÑA */
router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
