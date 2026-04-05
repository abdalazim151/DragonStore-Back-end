const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ACCESS_KEY = "dragonstore_access";
const REFRESH_KEY = "dragonstore_refresh";

export function getApiBase() {
  return API;
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function parseJwtPayload(token) {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isForm = options.body instanceof FormData;
  if (!isForm && options.body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const token = getStoredAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.msg ||
      (Array.isArray(data?.errors) && data.errors[0]) ||
      (typeof data === "string" ? data : null) ||
      res.statusText;
    const err = new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function googleAuthUrl() {
  return `${API}/auth/google`;
}
