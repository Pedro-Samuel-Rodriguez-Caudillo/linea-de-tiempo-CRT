import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: (() => {
    const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
    return repo ? `/${repo}/` : '/'
  })(),
  plugins: [react()],
})
