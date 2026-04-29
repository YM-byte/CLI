import { cancel, confirm, intro, isCancel, select, text } from '@clack/prompts';

import {
  BACKEND_LABELS,
  BACKEND_STACKS,
  DEFAULT_OPTIONS,
  FRONTEND_LABELS,
  FRONTEND_STACKS,
  MODE_LABELS,
  PROJECT_MODES,
} from '../constants/stacks.js';
import type { CreateCommandArgs, ProjectMode } from '../core/types.js';

function unwrapPromptValue<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel('已取消项目创建。');
    process.exit(0);
  }

  return value;
}

function toHint(isDefault: boolean): string | undefined {
  return isDefault ? '默认' : undefined;
}

export async function promptForMissingOptions(
  args: CreateCommandArgs,
): Promise<Partial<CreateCommandArgs>> {
  const answers: Partial<CreateCommandArgs> = {};

  intro('YM CLI');

  if (!args.projectName) {
    answers.projectName = unwrapPromptValue(
      await text({
        initialValue: 'ym-app',
        message: '项目名称',
        placeholder: '请输入项目名称',
        validate(value) {
          if (!value.trim()) {
            return '项目名称不能为空';
          }
        },
      }),
    ).trim();
  }

  if (!args.mode) {
    answers.mode = unwrapPromptValue(
      await select({
        initialValue: DEFAULT_OPTIONS.mode,
        message: '选择创建模式',
        options: PROJECT_MODES.map((mode) => ({
          hint: toHint(mode === DEFAULT_OPTIONS.mode),
          label: `${MODE_LABELS[mode]} (${mode})`,
          value: mode,
        })),
      }),
    );
  }

  const resolvedMode = (answers.mode ?? args.mode ?? DEFAULT_OPTIONS.mode) as ProjectMode;

  if (resolvedMode !== 'backend' && !args.frontend) {
    answers.frontend = unwrapPromptValue(
      await select({
        initialValue: DEFAULT_OPTIONS.frontend,
        message: '选择前端模板',
        options: FRONTEND_STACKS.map((stack) => ({
          hint: toHint(stack === DEFAULT_OPTIONS.frontend),
          label: `${stack} - ${FRONTEND_LABELS[stack]}`,
          value: stack,
        })),
      }),
    );
  }

  if (resolvedMode !== 'frontend' && !args.backend) {
    answers.backend = unwrapPromptValue(
      await select({
        initialValue: DEFAULT_OPTIONS.backend,
        message: '选择后端模板',
        options: BACKEND_STACKS.map((stack) => ({
          hint: toHint(stack === DEFAULT_OPTIONS.backend),
          label: `${stack} - ${BACKEND_LABELS[stack]}`,
          value: stack,
        })),
      }),
    );
  }

  if (args.e2e === undefined) {
    answers.e2e = unwrapPromptValue(
      await confirm({
        initialValue: DEFAULT_OPTIONS.e2e,
        message: '启用 E2E 测试？',
      }),
    );
  }

  if (args.docker === undefined) {
    answers.docker = unwrapPromptValue(
      await confirm({
        initialValue: DEFAULT_OPTIONS.docker,
        message: '生成 Docker 文件？',
      }),
    );
  }

  if (args.ci === undefined) {
    answers.ci = unwrapPromptValue(
      await confirm({
        initialValue: DEFAULT_OPTIONS.ci,
        message: '生成 CI 配置？',
      }),
    );
  }

  if (args.git === undefined) {
    answers.git = unwrapPromptValue(
      await confirm({
        initialValue: DEFAULT_OPTIONS.git,
        message: '初始化 Git 仓库？',
      }),
    );
  }

  if (args.install === undefined) {
    answers.install = unwrapPromptValue(
      await confirm({
        initialValue: DEFAULT_OPTIONS.install,
        message: '自动安装依赖？',
      }),
    );
  }

  return answers;
}
