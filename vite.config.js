import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '8d09-2401-4900-8f5d-8dad-1f3-3ff4-dd2b-9622.ngrok-free.app',
    ],
  },
})
