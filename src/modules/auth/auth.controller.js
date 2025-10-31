import { Router } from "express";
import { isValide } from "../../middleware/validation.middleware.js";
import { joiSchema, resetPasswordSchema } from "./auth.validation.js";
import { fileUpload } from "../../utils/multer/multer.local.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import * as authService from "./auth.service.js";

const router = Router();

router.post(
  "/register",
  fileUpload().none(), // parses body
  isValide(joiSchema),
  authService.register
); // The func must return 3 args so that's why in asyncH we return function with 3.
router.post("/login", authService.login);
router.post("/verify", authService.verifyAccount);
router.post("/resend-otp", authService.resendOTP);
router.patch(
  "/reset-password",
  isValide(resetPasswordSchema),
  // isAuthenticated,
  authService.resetPassword
);
router.post("/google-login", authService.googleLogin);
router.post("/logout", isAuthenticated, authService.logout);

export default router;
