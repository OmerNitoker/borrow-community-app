export function mapCommunity(community) {
  return {
    id: community._id.toString(),
    name: community.name,
    description: community.description,
    joinCode: community.joinCode,
    requiredApproval: community.requiredApproval,
    imageUrl: community.imageUrl,
    isDemoCommunity: community.isDemoCommunity,
    createdAt: community.createdAt
  };
}

export function mapMembership(membership) {
  return {
    id: membership._id.toString(),
    status: membership.status,
    role: membership.role,
    createdAt: membership.createdAt,
    community: membership.community?._id ? mapCommunity(membership.community) : membership.community?.toString()
  };
}
