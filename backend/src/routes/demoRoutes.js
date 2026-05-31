import express from "express";
import { enterDemoAsAdmin, enterDemoAsMember } from "../controllers/demoController.js";

const router = express.Router();

router.post("/enter", enterDemoAsMember);
router.post("/enter/member", enterDemoAsMember);
router.post("/enter/admin", enterDemoAsAdmin);

export default router;
