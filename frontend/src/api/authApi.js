import { apiRequest } from "./apiClient.js";

export function registerUser(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST"
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function updateCurrentUser(payload) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
