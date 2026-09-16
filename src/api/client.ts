import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/token"
import type { Nullable } from "@/types/common"

// Base URL config
const BASE_URL = "https://adidas-microservices-fkgu.onrender.com"

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  withCredentials: false,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
  },
  xsrfCookieName: "",
  xsrfHeaderName: "",
})

// 🔄 Redirect handler
const dispatchRedirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("customRedirectToLogin"))
  }
}

const isFormDataBody = (data: unknown): boolean =>
  typeof FormData !== "undefined" && data instanceof FormData

// 🔐 Attach tokens and guest_cart_id
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.withCredentials = false

    if (config.headers) {
      delete config.headers["X-CSRF-Token"]
      delete config.headers["X-CSRF-TOKEN"]
      delete config.headers["X-XSRF-TOKEN"]
    }

    // Browser must set multipart boundary. A hardcoded Content-Type breaks Rails params.
    if (isFormDataBody(config.data) && config.headers) {
      delete config.headers["Content-Type"]
      delete config.headers["content-type"]
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type")
        config.headers.delete("content-type")
      }
    } else if (config.headers && !config.headers["Content-Type"] && !config.headers["content-type"]) {
      config.headers["Content-Type"] = "application/json"
    }

    if (typeof window !== "undefined" && config.headers) {
      const token = getAccessToken()
      // FormData product uploads skip Authorization so POST stays a simple CORS request.
      if (token && !isFormDataBody(config.data)) {
        config.headers["Authorization"] = `Bearer ${token}`
      }

      const guestCartId = localStorage.getItem("guest_cart_id") ?? sessionStorage.getItem("guest_cart_id")
      const requestUrl = config.url || ""
      if (guestCartId && !requestUrl.includes("/api/admin/")) {
        const url = new URL(requestUrl, BASE_URL)
        if (!url.searchParams.has("guest_cart_id")) {
          url.searchParams.set("guest_cart_id", guestCartId)
          config.url = url.pathname + "?" + url.searchParams.toString()
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 🔄 Token Refresh Logic
interface FailedRequest {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let failedQueue: FailedRequest[] = []

let isRefreshing = false

const processQueue = (error: unknown, token: Nullable<string> = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response.data === "object" && response.data !== null) {
      return {
        ...response,
        _status: response.status,
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearTokens()
        dispatchRedirectToLogin()
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(`${BASE_URL}/refresh`, {
          refresh_token: refreshToken,
        })

        const newToken = res.data.token
        const newRefresh = res.data.refresh_token
        const rememberMe = !!localStorage.getItem("token")

        setTokens(newToken, newRefresh, rememberMe)
        api.defaults.headers["Authorization"] = `Bearer ${newToken}`
        processQueue(null, newToken)

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        clearTokens()
        dispatchRedirectToLogin()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    } else if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

export default api
