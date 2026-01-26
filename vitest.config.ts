import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 70,
                statements: 70
            },
            exclude: [
                'node_modules/',
                'dist/**',
                'docs/**',
                'vitest.config.ts',
                'vite.config.ts',
                'eslint.config.mjs',
                'src/cli/**',
                'src/outline/**',
                'src/objectives/**',
                'src/workspace/loader.ts',
            ]
        }
    },
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname
        }
    }
});
