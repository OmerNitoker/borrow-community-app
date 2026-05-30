import express from "express";
import { getCommunityOverview } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/community/:communityId/overview", requireAuth, getCommunityOverview);

export default router;
