import express from "express";
import { getMe } from "../controllers/authController.js";
import { getMyItems } from "../controllers/itemController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.get("/me/items", requireAuth, getMyItems);

export default router;
