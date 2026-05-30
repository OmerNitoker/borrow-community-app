import { Membership } from "../models/Membership.js";
import { createHttpError } from "../utils/createHttpError.js";

export async function getApprovedMembership(userId, communityId) {
  return Membership.findOne({
    user: userId,
    community: communityId,
    status: "approved"
  });
}

export async function requireCommunityAdmin(userId, communityId) {
  const membership = await Membership.findOne({
    user: userId,
    community: communityId,
    status: "approved",
    role: "admin"
  });

  if (!membership) {
    throw createHttpError(403, "Community admin access required.");
  }

  return membership;
}
