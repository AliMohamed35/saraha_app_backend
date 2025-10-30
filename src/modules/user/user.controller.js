import { Router } from "express";
import { fileUpload } from "../../utils/multer/multer.local.js";
import { fileUpload as fileUploadCloud } from "../../utils/multer/multer.cloud.js";
import { fileValidation } from "../../middleware/file-validation.middleware.js";
import * as userService from "./user.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();

router.get("/", isAuthenticated, userService.getProfile);
router.delete("/", isAuthenticated, userService.deleteAccount);
router.post(
  "/upload-profile-picture",
  isAuthenticated,
  fileUpload({ folder: "profile-pictures" }).single("profilePic"),
  fileValidation(),
  userService.uploadProfilePicture
);
router.post(
  "/upload-profile-cloud",
  isAuthenticated,
  fileUploadCloud().single("profilePicture"),
  userService.uploadProfilePictureCloud
);

export default router;
