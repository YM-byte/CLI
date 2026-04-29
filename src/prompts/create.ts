import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

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

function toYesNo(value: boolean): string {
  return value ? 'Y/n' : 'y/N';
}

function normalizeBooleanAnswer(value: string, fallback: boolean): boolean {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (['y', 'yes', 'true', '1'].includes(normalized)) {
    return true;
  }

  if (['n', 'no', 'false', '0'].includes(normalized)) {
    return false;
  }

  return fallback;
}

async function askWithDefault(
  question: string,
  fallback: string,
  rl: ReturnType<typeof createInterface>,
): Promise<string> {
  const answer = await rl.question(`${question} (${fallback}): `);
  return answer.trim() || fallback;
}

function formatChoiceList<T extends string>(choices: readonly T[], labels: Record<T, string>): string {
  return choices.map((choice) => `${choice} = ${labels[choice]}`).join(' / ');
}

export async function promptForMissingOptions(
  args: CreateCommandArgs,
): Promise<Partial<CreateCommandArgs>> {
  const rl = createInterface({ input, output });

  try {
    const answers: Partial<CreateCommandArgs> = {};

    if (!args.projectName) {
      answers.projectName = await askWithDefault('项目名称', 'ym-app', rl);
    }

    if (!args.mode) {
      answers.mode = await askWithDefault(
        `创建模式 [${formatChoiceList(PROJECT_MODES, MODE_LABELS)}]`,
        DEFAULT_OPTIONS.mode,
        rl,
      );
    }

    const resolvedMode = (answers.mode ?? args.mode ?? DEFAULT_OPTIONS.mode) as ProjectMode;

    if (resolvedMode !== 'backend' && !args.frontend) {
      answers.frontend = await askWithDefault(
        `前端模板 [${formatChoiceList(FRONTEND_STACKS, FRONTEND_LABELS)}]`,
        DEFAULT_OPTIONS.frontend,
        rl,
      );
    }

    if (resolvedMode !== 'frontend' && !args.backend) {
      answers.backend = await askWithDefault(
        `后端模板 [${formatChoiceList(BACKEND_STACKS, BACKEND_LABELS)}]`,
        DEFAULT_OPTIONS.backend,
        rl,
      );
    }

    if (args.e2e === undefined) {
      const answer = await rl.question(`启用 E2E 测试? (${toYesNo(DEFAULT_OPTIONS.e2e)}): `);
      answers.e2e = normalizeBooleanAnswer(answer, DEFAULT_OPTIONS.e2e);
    }

    if (args.docker === undefined) {
      const answer = await rl.question(`生成 Docker 文件? (${toYesNo(DEFAULT_OPTIONS.docker)}): `);
      answers.docker = normalizeBooleanAnswer(answer, DEFAULT_OPTIONS.docker);
    }

    if (args.ci === undefined) {
      const answer = await rl.question(`生成 CI 配置? (${toYesNo(DEFAULT_OPTIONS.ci)}): `);
      answers.ci = normalizeBooleanAnswer(answer, DEFAULT_OPTIONS.ci);
    }

    if (args.git === undefined) {
      const answer = await rl.question(`初始化 Git? (${toYesNo(DEFAULT_OPTIONS.git)}): `);
      answers.git = normalizeBooleanAnswer(answer, DEFAULT_OPTIONS.git);
    }

    if (args.install === undefined) {
      const answer = await rl.question(
        `自动安装依赖? (${toYesNo(DEFAULT_OPTIONS.install)}): `,
      );
      answers.install = normalizeBooleanAnswer(answer, DEFAULT_OPTIONS.install);
    }

    return answers;
  } finally {
    rl.close();
  }
}
