import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/sparkchat/' to match your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/sparkchat/',
})
