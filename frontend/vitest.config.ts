import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/Tests/setup.ts'],
    include: ['src/Tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/Tests/**', 'src/main.tsx', 'src/**/*.d.ts', 'src/types.ts'],
      reporter: ['text', 'html', 'json-summary', 'lcov'],
    },
  },
});
