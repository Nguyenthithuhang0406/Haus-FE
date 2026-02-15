import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Plugin để thay thế placeholder CSP bằng biến môi trường
const cspPlugin = {
  name: "csp-plugin",
  transformIndexHtml(html) {
    const cspStyle = process.env.VITE_CSP_STYLE || "";
    const cspConnect = process.env.VITE_CSP_CONNECT || "";
    
    // Thay thế placeholder bằng biến môi trường
    return html
      .replace("%VITE_CSP_STYLE%", cspStyle)
      .replace("%VITE_CSP_CONNECT%", cspConnect);
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [cspPlugin, react()],
  resolve: {
    alias: {
      /* eslint-disable no-undef */
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Thêm header bảo mật ở chế độ phát triển
    middlewares: [
      (req, res, next) => {
        // Các header này đã có trong meta tag index.html, thêm vào để đầy đủ
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader(
          "Permissions-Policy",
          "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
        );
        next();
      },
    ],
  },
});
