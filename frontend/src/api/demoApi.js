import { apiRequest } from "./apiClient.js";

export function enterDemo(mode = "member") {
  return apiRequest(`/demo/enter/${mode}`, {
    method: "POST"
  });
}
