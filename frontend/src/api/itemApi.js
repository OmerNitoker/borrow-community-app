import { apiRequest } from "./apiClient.js";

export function getItem(itemId) {
  return apiRequest(`/items/${itemId}`);
}

export function createItem(formData) {
  return apiRequest("/items", {
    method: "POST",
    body: formData
  });
}

export function updateItem(itemId, payload) {
  return apiRequest(`/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function addItemImages(itemId, formData) {
  return apiRequest(`/items/${itemId}/images`, {
    method: "POST",
    body: formData
  });
}

export function deleteItemImage(itemId, publicId) {
  return apiRequest(`/items/${itemId}/images/${encodeURIComponent(publicId)}`, {
    method: "DELETE"
  });
}

export function hideItem(itemId) {
  return apiRequest(`/items/${itemId}`, {
    method: "DELETE"
  });
}

export function getMyItems(communityId = "") {
  const query = communityId ? `?communityId=${communityId}` : "";
  return apiRequest(`/users/me/items${query}`);
}
