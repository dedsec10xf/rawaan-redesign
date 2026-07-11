import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Rolldown requires a function form (the classic Rollup object-map
        // shorthand isn't supported here).
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/gsap/') || id.includes('/@gsap/')) return 'gsap';
          if (id.includes('/framer-motion/')) return 'framer-motion';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react';
          return undefined;
        },
      },
    },
  },
})
