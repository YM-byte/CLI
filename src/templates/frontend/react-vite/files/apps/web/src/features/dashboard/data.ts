export interface DashboardMetric {
  description: string;
  label: string;
  value: string;
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  milestones: string[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return {
    metrics: [
      {
        label: '前端',
        value: 'React 19 + Vite 8',
        description: 'SPA / 后台管理的默认主力方案',
      },
      {
        label: '后端',
        value: '{{backendDisplay}}',
        description: '默认后端地址建议为 http://localhost:3001/api',
      },
      {
        label: '工程规范',
        value: 'ESLint / Prettier / Husky',
        description: '根级命令和提交规范已经统一收敛',
      },
    ],
    milestones: [
      '补充真实业务路由与页面',
      '完善接口封装和鉴权流程',
      '按模块拆分表单、列表和查询逻辑',
    ],
  };
}
