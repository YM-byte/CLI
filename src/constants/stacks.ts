import type { BackendStack, FrontendStack, PackageManager, ProjectMode } from '../core/types.js';

export const PROJECT_MODES: readonly ProjectMode[] = ['fullstack', 'frontend', 'backend'];

export const FRONTEND_STACKS: readonly FrontendStack[] = ['nextjs', 'react-vite', 'vue3-vite'];

export const BACKEND_STACKS: readonly BackendStack[] = ['nestjs', 'fastify', 'springboot'];

export const PACKAGE_MANAGERS: readonly PackageManager[] = ['pnpm'];

export const DEFAULT_OPTIONS = {
  backend: 'nestjs' as BackendStack,
  ci: true,
  docker: true,
  e2e: false,
  frontend: 'nextjs' as FrontendStack,
  git: true,
  install: true,
  mode: 'fullstack' as ProjectMode,
  packageManager: 'pnpm' as PackageManager,
};

export const MODE_LABELS: Record<ProjectMode, string> = {
  backend: '仅后端',
  frontend: '仅前端',
  fullstack: '全栈',
};

export const FRONTEND_LABELS: Record<FrontendStack, string> = {
  nextjs: 'Next.js + TypeScript + Tailwind CSS + shadcn/ui',
  'react-vite': 'React + Vite + TypeScript + React Router + TanStack Query + Ant Design',
  'vue3-vite': 'Vue 3 + Vite + TypeScript + Pinia + Vue Router + Element Plus',
};

export const BACKEND_LABELS: Record<BackendStack, string> = {
  fastify: 'Fastify + TypeScript + Zod + Prisma + PostgreSQL',
  nestjs: 'NestJS + TypeScript + Prisma + PostgreSQL',
  springboot: 'Spring Boot + Java + JPA + PostgreSQL',
};
