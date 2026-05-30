import { Item } from "../models/Item.js";
import { Membership } from "../models/Membership.js";

export async function getContactAccess({ userId, item }) {
  const membership = await Membership.findOne({
    user: userId,
    community: item.community,
    status: "approved"
  });

  if (!membership) {
    return {
      isApprovedMember: false,
      isCommunityAdmin: false,
      activeItemCount: 0,
      canViewContact: false
    };
  }

  const activeItemCount = await Item.countDocuments({
    owner: userId,
    community: item.community,
    isActive: true
  });

  const isOwner = item.owner._id
    ? item.owner._id.toString() === userId.toString()
    : item.owner.toString() === userId.toString();
  const isCommunityAdmin = membership.role === "admin";

  return {
    isApprovedMember: true,
    isCommunityAdmin,
    activeItemCount,
    canViewContact: !isOwner && (isCommunityAdmin || activeItemCount >= 3)
  };
}
