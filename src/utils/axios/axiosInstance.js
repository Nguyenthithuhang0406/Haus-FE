import axios from "axios";
import { get, set } from "lodash";
import { getCookie, removeAllCookies } from "../cookies";
import { refreshToken } from "@/api/auth";

const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    withCredentials: true,
  });
};

// Instance không token (dùng cho login, public...)
const axiosPublic = createAxiosInstance(import.meta.env.VITE_APP_URL_BE);

// Instance có token (dùng cho API cần đăng nhập)
const axiosPrivate = createAxiosInstance(import.meta.env.VITE_APP_URL_BE);

axiosPrivate.interceptors.request.use(
  (request) => {
    const token = getCookie("accessToken");
    if (!token) {
      return request;
    }
    set(request, "headers.Authorization", `Bearer ${token}`);
    return request;
  },
  (_error) => {
    console.log(
      "🚀 ~ axiosInstance.interceptors.request.use ~ _error:",
      _error
    );
    const errorResponse = {
      status: null,
      message: null,
      errors: null,
    };
    return Promise.reject(errorResponse);
  }
);

// ----- Response Interceptor -----
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => {
    // if (response && response.data) {
    //   return response.data;
    // }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosPrivate(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshToken();
        const { accessToken } = response.data;
        axiosPrivate.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;

        processQueue(null, accessToken);

        return axiosPrivate(originalRequest);
      } catch (error) {
        processQueue(error, null);
        removeAllCookies();
        window.location.href = "/auth";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    const errorResponse = {
      status: get(error, "response.status", null),
      message: get(error, "response.data.message", null),
      errors: get(error, "response.data.errors", null),
    };
    return Promise.reject(errorResponse);
  }
);
export { axiosPublic, axiosPrivate };
