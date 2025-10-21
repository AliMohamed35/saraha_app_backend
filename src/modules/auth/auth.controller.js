import { Router } from "express";
import { isValide } from "../../middleware/validation.middleware.js";
import { joiSchema } from "./auth.validation.js";
import { fileUpload } from "../../utils/multer/index.js";
import * as authService from "./auth.service.js";
const router = Router();

router.post(
  "/register",
  isValide(joiSchema),
  fileUpload().none(),
  authService.register
); // The func must return 3 args so that's why in asyncH we return function with 3.
router.post("/login", authService.login);
router.post("/verify", authService.verifyAccount);
router.post("/resend-otp", authService.resendOTP);
router.post("/google-login", authService.googleLogin);

export default router;
