import { Router } from "express";
import * as authService from "./auth.service.js";
const router = Router();

router.post("/register", authService.register);
router.post("/login", authService.login);
router.post("/verify", authService.verifyAccount);
router.post("/resend-otp", authService.resendOTP);

export default router;
