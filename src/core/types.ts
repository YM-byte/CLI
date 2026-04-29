export type ProjectMode = 'fullstack' | 'frontend' | 'backend';

export type FrontendStack = 'nextjs' | 'react-vite' | 'vue3-vite';

export type BackendStack = 'nestjs' | 'fastify' | 'springboot';

export type PackageManager = 'pnpm';

export interface ProjectOptions {
  projectName: string;
  mode: ProjectMode;
  frontend?: FrontendStack;
  backend?: BackendStack;
  packageManager: PackageManager;
  e2e: boolean;
  docker: boolean;
  ci: boolean;
  git: boolean;
  install: boolean;
}

export interface CreateCommandArgs {
  projectName?: string;
  mode?: string;
  frontend?: string;
  backend?: string;
  packageManager?: string;
  e2e?: boolean;
  docker?: boolean;
  ci?: boolean;
  git?: boolean;
  install?: boolean;
  yes?: boolean;
  help?: boolean;
}

export interface TemplateLayer {
  name: string;
  sourceDir: string;
}

export interface GenerationContext {
  cwd: string;
  targetDir: string;
  options: ProjectOptions;
  templateData: Record<string, string | boolean>;
}
