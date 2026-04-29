const RESET = '\x1b[0m';
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';

function print(color: string, level: string, message: string): void {
  console.log(`${color}${level}${RESET} ${message}`);
}

export const logger = {
  error(message: string): void {
    print(RED, 'error', message);
  },
  info(message: string): void {
    print(BLUE, 'info ', message);
  },
  success(message: string): void {
    print(GREEN, 'done ', message);
  },
  warn(message: string): void {
    print(YELLOW, 'warn ', message);
  },
};
