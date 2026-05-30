import { apiRequest } from "./apiClient.js";

export function getCommunityMemberships(communityId) {
  return apiRequest(`/memberships/community/${communityId}`);
}

export function cancelPendingMembership(communityId) {
  return apiRequest(`/memberships/community/${communityId}/me`, {
    method: "DELETE"
  });
}

export function approveMembership(membershipId) {
  return apiRequest(`/memberships/${membershipId}/approve`, {
    method: "PATCH"
  });
}

export function rejectMembership(membershipId) {
  return apiRequest(`/memberships/${membershipId}/reject`, {
    method: "PATCH"
  });
}
