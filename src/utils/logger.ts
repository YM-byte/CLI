import { stdout } from 'node:process';

import { log } from '@clack/prompts';

const RESET = '\x1b[0m';
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';

function useClackLog(): boolean {
  return stdout.isTTY;
}

function print(color: string, level: string, message: string): void {
  console.log(`${color}${level}${RESET} ${message}`);
}

export const logger = {
  error(message: string): void {
    if (useClackLog()) {
      log.error(message);
      return;
    }
    print(RED, 'error', message);
  },
  info(message: string): void {
    if (useClackLog()) {
      log.step(message);
      return;
    }
    print(BLUE, 'info ', message);
  },
  success(message: string): void {
    if (useClackLog()) {
      log.success(message);
      return;
    }
    print(GREEN, 'done ', message);
  },
  warn(message: string): void {
    if (useClackLog()) {
      log.warn(message);
      return;
    }
    print(YELLOW, 'warn ', message);
  },
};
