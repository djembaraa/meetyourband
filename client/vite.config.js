import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // String '/api' adalah awalan yang ingin kita proxy
      // Setiap kali ada permintaan ke '/api', Vite akan meneruskannya
      // ke server backend kita di localhost:3000.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
