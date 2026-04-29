import { describe, expect, it } from 'vitest';

import { buildProjectDashboardSummary } from './useProjectDashboard';

describe('buildProjectDashboardSummary', () => {
  it('returns three overview cards', () => {
    const summary = buildProjectDashboardSummary();

    expect(summary.cards).toHaveLength(3);
    expect(summary.actions[0].href).toContain('/api/health');
  });
});
