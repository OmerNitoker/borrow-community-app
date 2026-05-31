import { apiRequest } from "./apiClient.js";

export function getMyCommunities() {
  return apiRequest("/communities");
}

export function getCommunity(communityId) {
  return apiRequest(`/communities/${communityId}`);
}

export function getCommunityItems(communityId, filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  if (filters.page) {
    params.set("page", filters.page);
  }

  if (filters.limit) {
    params.set("limit", filters.limit);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/communities/${communityId}/items${query}`);
}

export function createCommunity(payload) {
  return apiRequest("/communities", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function joinCommunity(joinCode) {
  return apiRequest("/communities/join", {
    method: "POST",
    body: JSON.stringify({ joinCode })
  });
}
