import { Community } from "../models/Community.js";
import { Membership } from "../models/Membership.js";
import { requireCommunityAdmin } from "../services/membershipService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";
import { mapCommunity } from "../utils/mapCommunity.js";
import { mapMember } from "../utils/mapMember.js";

export const getCommunityMemberships = asyncHandler(async (req, res) => {
  await requireCommunityAdmin(req.user._id, req.params.communityId);

  const memberships = await Membership.find({ community: req.params.communityId })
    .populate("user")
    .sort({ status: 1, createdAt: -1 });

  res.json({ memberships: memberships.map(mapMember) });
});

export const approveMembership = asyncHandler(async (req, res) => {
  const membership = await updateMembershipStatus(req.user._id, req.params.membershipId, "approved");
  res.json({ membership: mapMember(membership) });
});

export const rejectMembership = asyncHandler(async (req, res) => {
  const membership = await updateMembershipStatus(req.user._id, req.params.membershipId, "rejected");
  res.json({ membership: mapMember(membership) });
});

export const cancelMyMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findOne({
    user: req.user._id,
    community: req.params.communityId,
    status: "pending"
  }).populate("community");

  if (!membership) {
    throw createHttpError(404, "Pending membership request not found.");
  }

  const community = membership.community;
  await membership.deleteOne();

  res.json({
    message: "Membership request canceled.",
    community: mapCommunity(community)
  });
});

async function updateMembershipStatus(adminUserId, membershipId, status) {
  const membership = await Membership.findById(membershipId).populate("user");

  if (!membership) {
    throw createHttpError(404, "Membership not found.");
  }

  const community = await Community.findById(membership.community);

  if (!community) {
    throw createHttpError(404, "Community not found.");
  }

  await requireCommunityAdmin(adminUserId, community._id);

  if (membership.role === "admin" && status !== "approved") {
    throw createHttpError(400, "Admin memberships cannot be rejected.");
  }

  membership.status = status;
  await membership.save();

  return membership;
}
