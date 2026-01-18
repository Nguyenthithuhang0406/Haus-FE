import { jwtDecode } from "jwt-decode";
import { getCookie } from "@/utils/cookies";
import { getAccessToken } from "@/utils/tokenMemory";

export function isLoggedIn() {
  // Prefer memory access token if present
  const accessToken = getAccessToken();
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp > currentTime) return true;
    } catch (error) {
      console.error("Invalid access token:", error);
      return false;
    }
  }

  // Fallback: if refreshToken cookie exists, consider user logged in
  // Requests may trigger refresh to obtain access token
  const refreshToken = getCookie("refreshToken");
  return Boolean(refreshToken);
}
