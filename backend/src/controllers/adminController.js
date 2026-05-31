import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";
import { getCommunityStats } from "../services/communityService.js";
import { requireCommunityAdmin } from "../services/membershipService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mapMember } from "../utils/mapMember.js";

export const getCommunityOverview = asyncHandler(async (req, res) => {
  await requireCommunityAdmin(req.user._id, req.params.communityId);

  const [memberships, totalItemCount, activeItemCount, stats] = await Promise.all([
    Membership.find({ community: req.params.communityId }).populate("user").sort({ status: 1, createdAt: -1 }),
    Item.countDocuments({ community: req.params.communityId }),
    Item.countDocuments({ community: req.params.communityId, isActive: true }),
    getCommunityStats(req.params.communityId)
  ]);

  const items = await Item.find({ community: req.params.communityId }).populate("owner", "name").sort({ createdAt: -1 });

  res.json({
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
      isActive: item.isActive,
      hiddenByAdmin: item.hiddenByAdmin,
      hiddenReason: item.hiddenReason,
      isDemoItem: item.isDemoItem,
      owner: {
        id: item.owner._id.toString(),
        name: item.owner.name
      },
      createdAt: item.createdAt
    }))
  });
});
