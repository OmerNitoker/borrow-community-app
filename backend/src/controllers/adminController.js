import { Community } from "../models/Community.js";
import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";
import { User } from "../models/User.js";
import { getCommunityStats } from "../services/communityService.js";
import { requireCommunityAdmin } from "../services/membershipService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/createHttpError.js";
import { mapCommunity } from "../utils/mapCommunity.js";
import { mapMember } from "../utils/mapMember.js";

export const getCommunityOverview = asyncHandler(async (req, res) => {
  await requireCommunityAdmin(req.user._id, req.params.communityId);
  const itemFilters = await getAdminItemFilters(req.query);
  const itemQuery = {
    community: req.params.communityId,
    isDeleted: { $ne: true },
    ...itemFilters.query
  };
  const itemLimit = getItemLimit(req.query.itemLimit);

  const [community, memberships, totalItemCount, activeItemCount, stats, filteredItemCount, items] = await Promise.all([
    Community.findById(req.params.communityId),
    Membership.find({ community: req.params.communityId }).populate("user").sort({ status: 1, createdAt: -1 }),
    Item.countDocuments({ community: req.params.communityId, isDeleted: { $ne: true } }),
    Item.countDocuments({ community: req.params.communityId, isActive: true, isDeleted: { $ne: true } }),
    getCommunityStats(req.params.communityId),
    Item.countDocuments(itemQuery),
    Item.find(itemQuery).populate("owner", "name").sort({ createdAt: -1 }).limit(itemLimit)
  ]);

  if (!community) {
    throw createHttpError(404, "Community not found.");
  }

  res.json({
    community: mapCommunity(community),
    stats: {
      ...stats,
      totalItemCount,
      activeItemCount
    },
    pendingMembers: memberships.filter((membership) => membership.status === "pending").map(mapMember),
    members: memberships.filter((membership) => membership.status === "approved").map(mapMember),
    items: items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      category: item.category,
      imageUrl: item.images[0]?.url || "",
      isActive: item.isActive,
      hiddenByAdmin: item.hiddenByAdmin,
      hiddenReason: item.hiddenReason,
      isDemoItem: item.isDemoItem,
      owner: {
        id: item.owner._id.toString(),
        name: item.owner.name
      },
      createdAt: item.createdAt
    })),
    itemsPagination: {
      limit: itemLimit,
      returnedItems: items.length,
      totalItems: filteredItemCount,
      hasMore: items.length < filteredItemCount
    }
  });
});

export const updateCommunitySettings = asyncHandler(async (req, res) => {
  await requireCommunityAdmin(req.user._id, req.params.communityId);

  if (typeof req.body.requiredApproval !== "boolean") {
    throw createHttpError(400, "requiredApproval must be a boolean.");
  }

  const community = await Community.findById(req.params.communityId);

  if (!community) {
    throw createHttpError(404, "Community not found.");
  }

  community.requiredApproval = req.body.requiredApproval;
  await community.save();

  res.json({
    community: mapCommunity(community)
  });
});

async function getAdminItemFilters(query) {
  const itemSearch = String(query.itemSearch || "").trim();
  const ownerSearch = String(query.ownerSearch || "").trim();
  const itemQuery = {};

  if (itemSearch) {
    itemQuery.title = { $regex: escapeRegex(itemSearch), $options: "i" };
  }

  if (ownerSearch) {
    const owners = await User.find({
      name: { $regex: escapeRegex(ownerSearch), $options: "i" }
    }).select("_id");

    itemQuery.owner = { $in: owners.map((owner) => owner._id) };
  }

  return { query: itemQuery };
}

function getItemLimit(limit) {
  const parsedLimit = Number.parseInt(limit, 10) || 12;
  return Math.min(60, Math.max(6, parsedLimit));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
