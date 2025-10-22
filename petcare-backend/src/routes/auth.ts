import { Router } from "express";
import { register, login, verifyOtp } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp); // ✅ Agrega esta línea

export default router;
