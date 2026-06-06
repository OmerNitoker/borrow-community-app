import express from "express";
import { getCommunityOverview, updateCommunitySettings } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/community/:communityId/overview", requireAuth, getCommunityOverview);
router.patch("/community/:communityId/settings", requireAuth, updateCommunitySettings);

export default router;
