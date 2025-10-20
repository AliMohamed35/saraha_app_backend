import { Router } from "express";
import { fileUpload } from "../../utils/multer/index.js";
import * as userService from "./user.service.js";
const router = Router();

router.delete("/", userService.deleteAccount);
router.post(
  "/upload-profile-picture",
  // fileUpload(), // this gives error because here we need function but this returns object!
  fileUpload().single("profilePic"), // single is middleware (return middleware that process single file)
  userService.uploadProfilePicture
);

export default router;
