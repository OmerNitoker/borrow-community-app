import express from "express";
import { enterDemo } from "../controllers/demoController.js";

const router = express.Router();

router.post("/enter", enterDemo);

export default router;
