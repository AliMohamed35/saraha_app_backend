import { Router } from "express";
import { fileUpload } from "../../utils/multer/multer.cloud.js";
import { isValide } from "../../middleware/validation.middleware.js";
import { sendMessageSchema, getMessageSchema } from "./message.validation.js";
import * as messageService from "./message.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/:receiver",
  fileUpload().array("attachments", 2), // inject req with files
  isValide(sendMessageSchema),
  messageService.sendMessage
);

// router.post(
//   "/:receiver/sender",
//   isAuthenticated,
//   fileUpload().array("attachments", 2), // inject req with files
//   isValide(sendMessageSchema),
//   messageService.sendMessage
// );

router.get(
  "/:id",
  isAuthenticated,
  isValide(getMessageSchema),
  messageService.getMessage
);
export default router;
