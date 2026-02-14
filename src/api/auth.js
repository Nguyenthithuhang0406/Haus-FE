import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/utils/tokenMemory";

export const register = async (data) => {
  const { username, password, firstName, lastName, email } = data;

  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/register",
      data: {
        username,
        password,
        firstName,
        lastName,
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOTP = async (data) => {
  const { email, otp } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/verify-otp",
      data: {
        email,
        otp,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (data) => {
  const { email, password } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/login",
      data: {
        username: email,
        password,
      },
    });

    const {
      accessToken,
      refreshToken,
      role,
      expiresIn = 600,
    } = response.data.data;
    // Store accessToken in memory with auto-refresh (short-lived: ~10 min default)
    setAccessToken(accessToken, expiresIn);
    // refreshToken is stored by BE in HTTP-only cookies (auto-sent by browser)
    // role stored in localStorage
    localStorage.setItem("role", role);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  const token = getAccessToken();
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/auth/logout",
      data: {
        token,
      },
    });
    // Clear memory token and localStorage
    clearAccessToken();
    localStorage.removeItem("role");
    // HTTP-only cookies will be cleared by BE
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    // refreshToken is sent automatically by browser in HTTP-only cookies
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/refresh",
    });
    const { accessToken, expiresIn = 600 } = response.data.data;
    // Update memory access token with new expiration
    setAccessToken(accessToken, expiresIn);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sentEmailForgotPassword = async (data) => {
  const { email } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/forgot-password",
      data: {
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const verifyOTPForForgotPassword = async (data) => {
  const { email, otp } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/verify-otp-to-reset-password",
      data: {
        email,
        otp,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
