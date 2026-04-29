import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: false,
    },
    environment: 'node',
    exclude: ['dist/**', 'node_modules/**', 'src/templates/**', 'tmp/**'],
  },
});
