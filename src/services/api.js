export const TOKEN_KEY = "eventsure_token";
export const USER_KEY = "eventsure_user";

const configuredUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_URL = configuredUrl.endsWith("/api") ? configuredUrl : `${configuredUrl}/api`;

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const apiRequest = async (path, { method = "GET", body, headers = {}, timeout = 15000, signal, auth = true } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });
  const requestHeaders = { Accept: "application/json", ...headers };
  const token = getToken();
  if (auth && token) requestHeaders.Authorization = `Bearer ${token}`;
  let requestBody = body;
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      method, headers: requestHeaders, body: requestBody, signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : null;
    if (!response.ok) {
      if (response.status === 401 && auth) clearSession();
      throw new ApiError(payload?.message || `Request failed with status ${response.status}`, response.status, payload?.errors || []);
    }
    return payload?.data ?? {};
  } catch (error) {
    if (error.name === "AbortError") throw new ApiError("The request timed out. Please try again.", 408);
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

// Response-compatible adapter for existing pages while they move to apiRequest.
export const apiFetch = async (input, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || 15000);
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let requestUrl = String(input);
  if (requestUrl.startsWith("undefined/api/")) requestUrl = `${API_URL}/${requestUrl.slice("undefined/api/".length)}`;
  requestUrl = requestUrl.replace(/\/api\/api\//, "/api/");
  try {
    const response = await fetch(requestUrl, { ...options, headers, signal: options.signal || controller.signal });
    const readJson = response.json.bind(response);
    Object.defineProperty(response, "json", {
      value: async () => {
        const payload = await readJson();
        if (response.status === 401) clearSession();
        return payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)
          ? { ...payload, ...payload.data }
          : payload;
      },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

export const downloadCsv = async (path, filename) => {
  const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!response.ok) throw new ApiError("Unable to export CSV", response.status);
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const authApi = {
  login: (credentials) => apiRequest("/auth/login", { method: "POST", body: credentials, auth: false }),
  register: (details) => apiRequest("/auth/register", { method: "POST", body: details, auth: false }),
  me: () => apiRequest("/auth/me"),
};

export default apiRequest;
