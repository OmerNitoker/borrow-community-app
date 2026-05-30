import { apiRequest } from "./apiClient.js";

export function getMyCommunities() {
  return apiRequest("/communities");
}

export function getCommunity(communityId) {
  return apiRequest(`/communities/${communityId}`);
}

export function getCommunityItems(communityId) {
  return apiRequest(`/communities/${communityId}/items`);
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
