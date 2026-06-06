import { Community } from "../models/Community.js";
import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";
import { createHttpError } from "../utils/createHttpError.js";
import { generateJoinCode } from "../utils/generateJoinCode.js";

async function createUniqueJoinCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const joinCode = generateJoinCode();
    const existingCommunity = await Community.findOne({ joinCode });

    if (!existingCommunity) {
      return joinCode;
    }
  }

  throw createHttpError(500, "Could not generate a unique community code.");
}

export async function createCommunityForUser(user, payload) {
  const name = String(payload.name || "").trim();
  const description = String(payload.description || "").trim();

  if (!name) {
    throw createHttpError(400, "Community name is required.");
  }

  const community = await Community.create({
    name,
    description,
    requiredApproval: payload.requiredApproval !== false,
    joinCode: await createUniqueJoinCode(),
    createdBy: user._id
  });

  await Membership.create({
    user: user._id,
    community: community._id,
    status: "approved",
    role: "admin"
  });

  return community;
}

export async function joinCommunityByCode(user, joinCodeInput) {
  const joinCode = String(joinCodeInput || "").trim().toUpperCase();

  if (!joinCode) {
    throw createHttpError(400, "Community code is required.");
  }

  const community = await Community.findOne({ joinCode });

  if (!community) {
    throw createHttpError(404, "Community not found.");
  }

  const existingMembership = await Membership.findOne({
    user: user._id,
    community: community._id
  });

  if (existingMembership) {
    if (existingMembership.status === "rejected") {
      existingMembership.status = community.requiredApproval ? "pending" : "approved";
      existingMembership.role = "member";
      await existingMembership.save();
    }

    return { community, membership: existingMembership, alreadyJoined: true };
  }

  const membership = await Membership.create({
    user: user._id,
    community: community._id,
    status: community.requiredApproval ? "pending" : "approved",
    role: "member"
  });

  return { community, membership, alreadyJoined: false };
}

export async function getCommunityStats(communityId) {
  const [memberCount, pendingCount, itemCount] = await Promise.all([
    Membership.countDocuments({ community: communityId, status: "approved" }),
    Membership.countDocuments({ community: communityId, status: "pending" }),
    Item.countDocuments({ community: communityId, isActive: true, isDeleted: { $ne: true } })
  ]);

  return { memberCount, pendingCount, itemCount };
}
