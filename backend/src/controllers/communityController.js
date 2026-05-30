import { Community } from "../models/Community.js";
import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";
import { createCommunityForUser, getCommunityStats, joinCommunityByCode } from "../services/communityService.js";
import { getApprovedMembership } from "../services/membershipService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";
import { mapCommunity, mapMembership } from "../utils/mapCommunity.js";
import { mapItemCard } from "../utils/mapItemCard.js";

export const getMyCommunities = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({ user: req.user._id })
    .populate("community")
    .sort({ updatedAt: -1 });

  res.json({ memberships: memberships.map(mapMembership) });
});

export const createCommunity = asyncHandler(async (req, res) => {
  const community = await createCommunityForUser(req.user, req.body);
  const membership = await Membership.findOne({ user: req.user._id, community: community._id }).populate("community");

  res.status(201).json({
    community: mapCommunity(community),
    membership: mapMembership(membership)
  });
});

export const joinCommunity = asyncHandler(async (req, res) => {
  const { community, membership, alreadyJoined } = await joinCommunityByCode(req.user, req.body.joinCode);
  const populatedMembership = await Membership.findById(membership._id).populate("community");

  res.status(alreadyJoined ? 200 : 201).json({
    community: mapCommunity(community),
    membership: mapMembership(populatedMembership),
    alreadyJoined
  });
});

export const getCommunity = asyncHandler(async (req, res) => {
  const membership = await getApprovedMembership(req.user._id, req.params.communityId);

  if (!membership) {
    throw createHttpError(403, "Approved community membership required.");
  }

  const community = await Community.findById(req.params.communityId);

  if (!community) {
    throw createHttpError(404, "Community not found.");
  }

  res.json({
    community: mapCommunity(community),
    membership: {
      id: membership._id.toString(),
      status: membership.status,
      role: membership.role
    },
    stats: await getCommunityStats(community._id)
  });
});

export const getCommunityItems = asyncHandler(async (req, res) => {
  const membership = await getApprovedMembership(req.user._id, req.params.communityId);

  if (!membership) {
    throw createHttpError(403, "Approved community membership required.");
  }

  const query = {
    community: req.params.communityId,
    isActive: true
  };

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.search) {
    const search = String(req.query.search).trim();

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }
  }

  const sort = getItemSort(req.query.sort);

  const [items, activeItemCount] = await Promise.all([
    Item.find(query).sort(sort),
    Item.countDocuments({
      community: req.params.communityId,
      owner: req.user._id,
      isActive: true
    })
  ]);

  res.json({
    items: items.map((item) =>
      mapItemCard(item, {
        userId: req.user._id,
        isCommunityAdmin: membership.role === "admin",
        activeItemCount
      })
    ),
    accessStatus: {
      isCommunityAdmin: membership.role === "admin",
      activeItemCount,
      requiredActiveItemCount: 3,
      canViewContact: membership.role === "admin" || activeItemCount >= 3
    }
  });
});

function getItemSort(sort) {
  if (sort === "name") {
    return { title: 1 };
  }

  if (sort === "oldest") {
    return { createdAt: 1 };
  }

  return { createdAt: -1 };
}
