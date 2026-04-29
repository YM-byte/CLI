<script setup lang="ts">
import ProjectHero from '../components/dashboard/ProjectHero.vue';
import StackHighlights from '../components/dashboard/StackHighlights.vue';
import { useDashboardStore } from '../stores/dashboard';

const dashboardStore = useDashboardStore();
</script>

<template>
  <main class="dashboard-view">
    <div class="dashboard-view__inner">
      <ProjectHero
        :actions="dashboardStore.summary.actions"
        :title="dashboardStore.summary.title"
      />
      <StackHighlights :cards="dashboardStore.summary.cards" />
    </div>
  </main>
</template>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(110, 231, 183, 0.35), transparent 28%),
    linear-gradient(135deg, #f0fdf4, #ecfeff 52%, #f8fafc);
  padding: 32px;
}

.dashboard-view__inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  max-width: 1200px;
}
</style>
