import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from 'tailwindcss';
import { defineConfig } from "vite"


export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    server: {
    port: 3001,
  },

})

