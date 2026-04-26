import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const TOKEN_KEY = "sb_token";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function getApiError(err: unknown): string {
  const ax = err as AxiosError<any>;
  const data = ax.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().join("; ");
  }
  return data?.detail || data?.title || ax.message || "Сталася помилка";
}

export function notifyError(err: unknown) {
  toast.error(getApiError(err));
}
