import express from "express";
import {
  approveMembership,
  cancelMyMembership,
  getCommunityMemberships,
  rejectMembership
} from "../controllers/membershipController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/community/:communityId", requireAuth, getCommunityMemberships);
router.delete("/community/:communityId/me", requireAuth, cancelMyMembership);
router.patch("/:membershipId/approve", requireAuth, approveMembership);
router.patch("/:membershipId/reject", requireAuth, rejectMembership);

export default router;
