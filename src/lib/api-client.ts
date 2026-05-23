/**
 * api-client.ts
 *
 * Axios instance with request/response interceptors.
 * Mirrors the pattern from qm-admin-pwa-1/src/app/lib/api-client.ts.
 *
 * - Attaches Authorization: Bearer <token> on every request
 * - Auto-refreshes access token on 401 and retries the original request
 * - On refresh failure: clears tokens + redirects to /login
 *
 * NEVER import fetch/axios directly in components or API modules.
 * Always import `api` from this file.
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}
import { tokenStorage } from "@/lib/auth-store";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor — Attach Access Token ────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((config as any).skipAuth) return config;
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — Handle 401 + Token Refresh ───────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Multiple concurrent requests all 401 → queue them, do one refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          },
        );

        const { access_token, refresh_token } = response.data.data as {
          access_token: string;
          refresh_token: string;
        };

        tokenStorage.setTokens(access_token, refresh_token);
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = api;
export default api;
