import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ✅ enables describe/it/expect
    environment: 'jsdom',
    setupFiles: resolve(__dirname, 'setupTests.js'), // ✅ points to setup
  },
})
