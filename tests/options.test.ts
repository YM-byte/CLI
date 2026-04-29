import { describe, expect, it } from 'vitest';

import { resolveProjectOptions } from '../src/core/options.js';

describe('resolveProjectOptions', () => {
  it('在仅前端模式下移除 backend', async () => {
    const options = await resolveProjectOptions({
      backend: 'nestjs',
      frontend: 'nextjs',
      mode: 'frontend',
      projectName: 'demo-app',
      yes: true,
    });

    expect(options.backend).toBeUndefined();
    expect(options.frontend).toBe('nextjs');
  });

  it('在 yes 模式下使用默认值补齐布尔选项', async () => {
    const options = await resolveProjectOptions({
      projectName: 'demo-app',
      yes: true,
    });

    expect(options.git).toBe(true);
    expect(options.install).toBe(true);
    expect(options.docker).toBe(true);
  });
});
