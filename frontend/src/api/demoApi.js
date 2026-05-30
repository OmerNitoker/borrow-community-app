import { apiRequest } from "./apiClient.js";

export function enterDemo() {
  return apiRequest("/demo/enter", {
    method: "POST"
  });
}
