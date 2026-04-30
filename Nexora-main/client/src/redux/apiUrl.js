const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

const BASE_DOMAIN =
  envBaseUrl && envBaseUrl.trim().length > 0
    ? envBaseUrl.trim()
    : "http://localhost:5004";

export const API_BASE_URL = `${BASE_DOMAIN.replace(/\/$/, "")}/api`;
