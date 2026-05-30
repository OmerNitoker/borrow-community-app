export function mapItemDetail(item, access) {
  const ownerId = item.owner._id.toString();

  return {
    item: {
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      notes: item.notes,
      condition: item.condition,
      category: item.category,
      community: item.community.toString(),
      owner: {
        id: ownerId
      },
      images: item.images,
      isActive: item.isActive,
      hiddenByAdmin: item.hiddenByAdmin,
      hiddenReason: item.hiddenReason,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    },
    viewer: {
      isOwner: ownerId === access.userId.toString(),
      isApprovedMember: access.isApprovedMember,
      isCommunityAdmin: access.isCommunityAdmin,
      activeItemCount: access.activeItemCount,
      requiredActiveItemCount: 3,
      canViewContact: access.canViewContact
    },
    ownerContact: access.canViewContact
      ? {
          name: item.owner.name,
          phone: item.owner.phone
        }
      : null
  };
}
