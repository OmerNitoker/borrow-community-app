export function mapMember(membership) {
  return {
    id: membership._id.toString(),
    status: membership.status,
    role: membership.role,
    requestedAt: membership.createdAt,
    user: {
      id: membership.user._id.toString(),
      name: membership.user.name,
      email: membership.user.email,
      avatarUrl: membership.user.avatarUrl,
      isDemoUser: membership.user.isDemoUser
    }
  };
}
