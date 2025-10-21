import { Router } from "express";
import { fileUpload } from "../../utils/multer/index.js";
import { fileValidation } from "../../middleware/file-validation.middleware.js";
import * as userService from "./user.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();

router.delete("/", userService.deleteAccount);
router.post(
  "/upload-profile-picture",
  isAuthenticated,
  fileUpload({ folder: "profile-pictures" }).single("profilePic"),
  fileValidation(),
  userService.uploadProfilePicture
);

export default router;
