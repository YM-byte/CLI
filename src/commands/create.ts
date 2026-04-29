import { cwd } from 'node:process';

import { generateProject } from '../core/generator.js';
import { resolveProjectOptions } from '../core/options.js';
import type { CreateCommandArgs } from '../core/types.js';
import { logger } from '../utils/logger.js';

function parseBooleanToken(token: string | undefined): boolean | undefined {
  if (token === undefined) {
    return undefined;
  }

  const normalized = token.trim().toLowerCase();

  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  return undefined;
}

function readFlagValue(args: string[], index: number): string | undefined {
  const next = args[index + 1];
  if (!next || next.startsWith('-')) {
    return undefined;
  }
  return next;
}

export function printCreateHelp(): void {
  console.log(`YM CLI - create

用法:
  ym create <project-name> [options]

选项:
  --mode <fullstack|frontend|backend>
  --frontend <nextjs|react-vite|vue3-vite>
  --backend <nestjs|fastify|springboot>
  --e2e [true|false]
  --docker [true|false]
  --ci [true|false]
  --git [true|false]
  --install [true|false]
  --package-manager <pnpm>
  --yes
  -h, --help

示例:
  ym create demo-app --mode fullstack --frontend nextjs --backend nestjs --yes
  ym create admin-app --mode fullstack --frontend react-vite --backend fastify --yes
  ym create order-service --mode backend --backend springboot --yes
`);
}

export function parseCreateArgs(argv: string[]): CreateCommandArgs {
  const parsed: CreateCommandArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '-h' || token === '--help') {
      parsed.help = true;
      continue;
    }

    if (token === '--yes') {
      parsed.yes = true;
      continue;
    }

    if (token.startsWith('--no-')) {
      const key = token.slice(5);
      if (key === 'e2e' || key === 'docker' || key === 'ci' || key === 'git' || key === 'install') {
        parsed[key] = false;
      }
      continue;
    }

    if (!token.startsWith('--') && !parsed.projectName) {
      parsed.projectName = token;
      continue;
    }

    const value = readFlagValue(argv, index);

    switch (token) {
      case '--mode':
        parsed.mode = value;
        index += value ? 1 : 0;
        break;
      case '--frontend':
        parsed.frontend = value;
        index += value ? 1 : 0;
        break;
      case '--backend':
        parsed.backend = value;
        index += value ? 1 : 0;
        break;
      case '--package-manager':
        parsed.packageManager = value;
        index += value ? 1 : 0;
        break;
      case '--e2e':
      case '--docker':
      case '--ci':
      case '--git':
      case '--install': {
        const normalized = parseBooleanToken(value);
        parsed[token.slice(2) as 'e2e' | 'docker' | 'ci' | 'git' | 'install'] =
          normalized ?? true;
        index += value ? 1 : 0;
        break;
      }
      default:
        throw new Error(`未知参数：${token}`);
    }
  }

  return parsed;
}

function printSummary(args: Awaited<ReturnType<typeof resolveProjectOptions>>): void {
  logger.info('创建配置如下：');
  console.log(`  项目名称: ${args.projectName}`);
  console.log(`  创建模式: ${args.mode}`);
  console.log(`  前端模板: ${args.frontend ?? '未启用'}`);
  console.log(`  后端模板: ${args.backend ?? '未启用'}`);
  console.log(`  包管理器: ${args.packageManager}`);
  console.log(`  E2E: ${args.e2e ? 'yes' : 'no'}`);
  console.log(`  Docker: ${args.docker ? 'yes' : 'no'}`);
  console.log(`  CI: ${args.ci ? 'yes' : 'no'}`);
  console.log(`  Git: ${args.git ? 'yes' : 'no'}`);
  console.log(`  Install: ${args.install ? 'yes' : 'no'}`);
}

export async function runCreateCommand(argv: string[]): Promise<void> {
  const parsedArgs = parseCreateArgs(argv);

  if (parsedArgs.help) {
    printCreateHelp();
    return;
  }

  const options = await resolveProjectOptions(parsedArgs);
  printSummary(options);
  await generateProject(cwd(), options);
}
