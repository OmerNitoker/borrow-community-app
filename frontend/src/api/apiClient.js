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
    throw new Error(getFriendlyErrorMessage(data.message));
  }

  return data;
}

function getFriendlyErrorMessage(message) {
  if (!message) {
    return "הבקשה נכשלה. נסה שוב.";
  }

  if (message.includes("Protected demo items")) {
    return "זהו פריט דמו מוגן. אפשר ליצור פריטים חדשים בדמו, אבל אי אפשר לשנות את הפריטים המוכנים.";
  }

  if (message.includes("Items hidden by an admin cannot be reactivated")) {
    return "פריט שהוסתר על ידי מנהל קהילה לא ניתן להפעלה מחדש.";
  }

  return message;
}
