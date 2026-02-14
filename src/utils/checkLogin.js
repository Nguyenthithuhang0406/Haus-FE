import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/utils/tokenMemory";

export function isLoggedIn() {
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
  return false;
}
