import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` must match the GitHub Pages project sub-path: https://<user>.github.io/tebak-kata/
export default defineConfig({
  base: '/tebak-kata/',
  plugins: [react(), tailwindcss()],
})
