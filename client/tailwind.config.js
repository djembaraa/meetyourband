// Impor plugin baru yang sudah kita install
import tailwindcss from "@tailwindcss/vite";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // Daftarkan plugin di sini
  plugins: [tailwindcss()],
};
