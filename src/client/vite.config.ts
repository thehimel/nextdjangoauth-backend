import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from "vite-plugin-environment";

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000';
const CLIENT_ENV = {
  API_URL: API_URL,
  ENVIRONMENT: process.env.ENVIRONMENT || 'prod',
  DEBUG: process.env.DEBUG || 'False',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(CLIENT_ENV)
  ],
  build: {
    assetsDir: 'static',
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
      }
    }
  },
})
