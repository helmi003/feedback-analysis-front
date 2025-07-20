import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          
          // UI library
          'antd-vendor': ['antd'],
          
          // Charts
          'charts-vendor': ['recharts'],
          
          // HTTP and state management
          'data-vendor': ['axios', 'react-query'],
          
          // Routing and utilities
          'utils-vendor': ['react-router-dom', 'dayjs', 'react-intl']
        }
      }
    },
    // Increase chunk size warning limit to 1000kB (optional)
    chunkSizeWarningLimit: 1000
  }
})
