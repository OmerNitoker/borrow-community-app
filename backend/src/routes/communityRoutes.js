import express from "express";
import {
  createCommunity,
  getCommunity,
  getCommunityItems,
  getMyCommunities,
  joinCommunity
} from "../controllers/communityController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getMyCommunities);
router.post("/", requireAuth, createCommunity);
router.post("/join", requireAuth, joinCommunity);
router.get("/:communityId/items", requireAuth, getCommunityItems);
router.get("/:communityId", requireAuth, getCommunity);

export default router;
