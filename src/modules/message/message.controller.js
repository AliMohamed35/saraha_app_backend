import { Router } from "express";
import { fileUpload } from "../../utils/multer/multer.cloud.js";
import { isValide } from "../../middleware/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";
import { sendMessage } from "./message.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/:receiver",
  fileUpload().array("attachments", 2), // inject req with files
  isValide(sendMessageSchema),
  sendMessage
);

router.post(
  "/:receiver/sender",
  isAuthenticated,
  fileUpload().array("attachments", 2), // inject req with files
  isValide(sendMessageSchema),
  sendMessage
);
export default router;
