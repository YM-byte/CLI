import { BACKEND_STACKS, FRONTEND_STACKS, PACKAGE_MANAGERS, PROJECT_MODES } from '../constants/stacks.js';
import type { ProjectOptions } from './types.js';

function isSafeProjectName(value: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*$/i.test(value);
}

export function validateProjectOptions(options: ProjectOptions): void {
  const issues: string[] = [];

  if (!options.projectName) {
    issues.push('项目名称不能为空。');
  } else if (!isSafeProjectName(options.projectName)) {
    issues.push('项目名称只允许字母、数字、点、下划线和中划线，且必须以字母或数字开头。');
  }

  if (!PROJECT_MODES.includes(options.mode)) {
    issues.push(`不支持的创建模式：${options.mode}`);
  }

  if (!PACKAGE_MANAGERS.includes(options.packageManager)) {
    issues.push(`当前仅支持 pnpm，收到：${options.packageManager}`);
  }

  if (options.mode !== 'backend' && !options.frontend) {
    issues.push('当前模式需要指定前端模板。');
  }

  if (options.mode !== 'frontend' && !options.backend) {
    issues.push('当前模式需要指定后端模板。');
  }

  if (options.frontend && !FRONTEND_STACKS.includes(options.frontend)) {
    issues.push(`不支持的前端模板：${options.frontend}`);
  }

  if (options.backend && !BACKEND_STACKS.includes(options.backend)) {
    issues.push(`不支持的后端模板：${options.backend}`);
  }

  if (issues.length > 0) {
    throw new Error(issues.join('\n'));
  }
}
