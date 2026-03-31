// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cleanPlugin from 'vite-plugin-clean';

export default defineConfig({
  plugins: [react(), cleanPlugin()],
  server: {
    host: "localhost",
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1000, // para no ver el warning
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
          maplibre: ['maplibre-gl'],
          bootstrap: ['react-bootstrap', 'bootstrap', '@popperjs/core'],
          fontawesome: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/react-fontawesome'
          ],
          reactPdf: ['@react-pdf/renderer'],
          
          motion: ['framer-motion'],
          axios: ['axios'],
        }
      }
    }
  }
});
