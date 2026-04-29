import { BACKEND_LABELS, FRONTEND_LABELS, MODE_LABELS } from '../constants/stacks.js';
import type { GenerationContext, ProjectOptions } from './types.js';

function toStatus(value: boolean): string {
  return value ? '启用' : '未启用';
}

function toJavaPackageSegment(value: string): string {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return normalized || 'app';
}

function toPascalCase(value: string): string {
  const parts = value
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return 'Ym';
  }

  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

export function createGenerationContext(cwd: string, targetDir: string, options: ProjectOptions): GenerationContext {
  const javaPackageSegment = toJavaPackageSegment(options.projectName);
  const javaPackage = `com.ym.${javaPackageSegment}`;
  const projectClassName = toPascalCase(options.projectName);

  return {
    cwd,
    options,
    targetDir,
    templateData: {
      backendDisplay: options.backend ? BACKEND_LABELS[options.backend] : '未启用',
      ciStatus: toStatus(options.ci),
      dockerStatus: toStatus(options.docker),
      e2eStatus: toStatus(options.e2e),
      frontendDisplay: options.frontend ? FRONTEND_LABELS[options.frontend] : '未启用',
      generatedAt: new Date().toISOString(),
      javaPackage,
      javaPackagePath: javaPackage.replaceAll('.', '/'),
      mode: options.mode,
      modeLabel: MODE_LABELS[options.mode],
      packageManager: options.packageManager,
      projectClassName,
      projectName: options.projectName,
    },
  };
}
