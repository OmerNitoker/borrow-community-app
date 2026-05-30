function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname = window.location.hostname || "localhost";
  return `http://${hostname}:5000/api`;
}

const API_BASE_URL = getApiBaseUrl();

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? options.headers
    : {
        "Content-Type": "application/json",
        ...options.headers
      };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "הבקשה נכשלה. נסה שוב.");
  }

  return data;
}
