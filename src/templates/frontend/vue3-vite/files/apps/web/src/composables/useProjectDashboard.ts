export interface StackCard {
  description: string;
  label: string;
  value: string;
}

export interface ProjectDashboardSummary {
  actions: Array<{ href: string; label: string }>;
  cards: StackCard[];
  title: string;
}

export function buildProjectDashboardSummary(): ProjectDashboardSummary {
  return {
    title: '{{projectName}}',
    cards: [
      {
        label: '前端',
        value: 'Vue 3 + Vite + Element Plus',
        description: '默认使用 Composition API 与 <script setup lang="ts">。',
      },
      {
        label: '后端',
        value: '{{backendDisplay}}',
        description: '建议联调地址为 http://localhost:3001/api。',
      },
      {
        label: '状态与路由',
        value: 'Pinia + Vue Router',
        description: '适合中后台项目按模块拆分状态和导航。',
      },
    ],
    actions: [
      {
        href: 'http://localhost:3001/api/health',
        label: '打开后端健康检查',
      },
      {
        href: 'https://cn.vite.dev/guide/',
        label: '查看 Vite 文档',
      },
    ],
  };
}
