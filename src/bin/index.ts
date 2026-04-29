#!/usr/bin/env node

import { runCreateCommand } from '../commands/create.js';
import { logger } from '../utils/logger.js';

function printRootHelp(): void {
  console.log(`YM CLI

用法:
  ym <command>

命令:
  create    创建新的团队标准工程

选项:
  -h, --help    查看帮助

示例:
  ym create demo-app
  ym create demo-app --mode fullstack --frontend nextjs --backend nestjs --yes
  ym create admin-app --mode fullstack --frontend react-vite --backend fastify --yes
  ym create order-service --mode backend --backend springboot --yes
`);
}

async function main(): Promise<void> {
  const [, , command, ...rest] = process.argv;

  if (!command || command === '-h' || command === '--help') {
    printRootHelp();
    return;
  }

  if (command === 'create') {
    await runCreateCommand(rest);
    return;
  }

  if (command === 'help') {
    printRootHelp();
    return;
  }

  throw new Error(`未知命令：${command}`);
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
