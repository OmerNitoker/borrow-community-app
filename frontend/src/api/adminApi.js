import { apiRequest } from "./apiClient.js";

export function getCommunityOverview(communityId) {
  return apiRequest(`/admin/community/${communityId}/overview`);
}
