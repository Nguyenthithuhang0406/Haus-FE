import { jwtDecode } from "jwt-decode";
import { getCookie } from "@/utils/cookies";

export function isLoggedIn() {
  const token = getCookie("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token); // Giải mã JWT mà không cần secret
    const currentTime = Date.now() / 1000; // tính bằng giây
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}
