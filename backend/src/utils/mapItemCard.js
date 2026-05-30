export function mapItemCard(item, viewer) {
  const ownerId = item.owner.toString();
  const isOwner = ownerId === viewer.userId.toString();
  const canViewContact = viewer.isCommunityAdmin || viewer.activeItemCount >= 3;

  return {
    id: item._id.toString(),
    title: item.title,
    description: item.description,
    category: item.category,
    condition: item.condition,
    imageUrl: item.images[0]?.url || "",
    isActive: item.isActive,
    viewer: {
      isOwner,
      canViewContact: !isOwner && canViewContact
    },
    createdAt: item.createdAt
  };
}
