import { Router } from "express";
import * as userService from "./user.service.js";
const router = Router();

router.delete("/:id", userService.deleteAccount);

export default router;
