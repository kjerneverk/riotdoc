import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/riotdoc/',  // GitHub Pages project path
    publicDir: 'public',
    preview: {
        port: 4173,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
})
