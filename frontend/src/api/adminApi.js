import { apiRequest } from "./apiClient.js";

export function getCommunityOverview(communityId, filters = {}) {
  const params = new URLSearchParams();

  if (filters.itemSearch) {
    params.set("itemSearch", filters.itemSearch);
  }

  if (filters.ownerSearch) {
    params.set("ownerSearch", filters.ownerSearch);
  }

  if (filters.itemLimit) {
    params.set("itemLimit", filters.itemLimit);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/admin/community/${communityId}/overview${query}`);
}
