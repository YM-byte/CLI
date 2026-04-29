import { defineStore } from 'pinia';
import { readonly, shallowRef } from 'vue';

import { buildProjectDashboardSummary } from '../composables/useProjectDashboard';

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = shallowRef(buildProjectDashboardSummary());

  return {
    summary: readonly(summary),
  };
});
