import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all common API paths to localhost
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:5000/api", // Rewrite needed if frontend doesn't use /api prefix
        changeOrigin: true,
        rewrite: (path) => '/api' + path
      },
      "/users": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        rewrite: (path) => '/api' + path
      },
      "/accounts": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        rewrite: (path) => '/api' + path
      },
      "/operations": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        rewrite: (path) => '/api' + path
      },
    },
  },
});
