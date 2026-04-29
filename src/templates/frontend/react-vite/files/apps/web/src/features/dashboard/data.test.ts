import { describe, expect, it } from 'vitest';

import { fetchDashboardSummary } from './data';

describe('fetchDashboardSummary', () => {
  it('returns project dashboard cards', async () => {
    const summary = await fetchDashboardSummary();

    expect(summary.metrics).toHaveLength(3);
    expect(summary.milestones[0]).toContain('补充真实业务路由');
  });
});
