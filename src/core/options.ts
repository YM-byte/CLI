import { stdin, stdout } from 'node:process';

import {
  BACKEND_STACKS,
  DEFAULT_OPTIONS,
  FRONTEND_STACKS,
  PACKAGE_MANAGERS,
  PROJECT_MODES,
} from '../constants/stacks.js';
import { promptForMissingOptions } from '../prompts/create.js';
import type {
  BackendStack,
  CreateCommandArgs,
  FrontendStack,
  PackageManager,
  ProjectMode,
  ProjectOptions,
} from './types.js';
import { validateProjectOptions } from './validator.js';

function asBoolean(value: boolean | undefined, fallback: boolean): boolean {
  return value ?? fallback;
}

function hasValue<T extends string>(value: string | undefined, candidates: readonly T[]): value is T {
  return value !== undefined && candidates.includes(value as T);
}

function needsInteractivePrompt(rawArgs: CreateCommandArgs): boolean {
  if (!rawArgs.projectName || !rawArgs.mode) {
    return true;
  }

  const resolvedMode = hasValue(rawArgs.mode, PROJECT_MODES)
    ? (rawArgs.mode as ProjectMode)
    : DEFAULT_OPTIONS.mode;

  if (resolvedMode !== 'backend' && !rawArgs.frontend) {
    return true;
  }

  if (resolvedMode !== 'frontend' && !rawArgs.backend) {
    return true;
  }

  return (
    rawArgs.e2e === undefined ||
    rawArgs.docker === undefined ||
    rawArgs.ci === undefined ||
    rawArgs.git === undefined ||
    rawArgs.install === undefined
  );
}

export async function resolveProjectOptions(rawArgs: CreateCommandArgs): Promise<ProjectOptions> {
  if (!rawArgs.yes && needsInteractivePrompt(rawArgs) && (!stdin.isTTY || !stdout.isTTY)) {
    throw new Error('当前终端不支持交互，请补全命令参数或追加 --yes。');
  }

  const promptedArgs = rawArgs.yes ? {} : await promptForMissingOptions(rawArgs);
  const merged = {
    ...DEFAULT_OPTIONS,
    ...rawArgs,
    ...promptedArgs,
  };

  const mode = hasValue(merged.mode, PROJECT_MODES) ? (merged.mode as ProjectMode) : merged.mode;
  const frontend = hasValue(merged.frontend, FRONTEND_STACKS)
    ? (merged.frontend as FrontendStack)
    : merged.frontend;
  const backend = hasValue(merged.backend, BACKEND_STACKS)
    ? (merged.backend as BackendStack)
    : merged.backend;
  const packageManager = hasValue(merged.packageManager, PACKAGE_MANAGERS)
    ? (merged.packageManager as PackageManager)
    : DEFAULT_OPTIONS.packageManager;

  const normalized: ProjectOptions = {
    projectName: merged.projectName?.trim() ?? '',
    mode: (mode ?? DEFAULT_OPTIONS.mode) as ProjectMode,
    frontend: frontend as FrontendStack | undefined,
    backend: backend as BackendStack | undefined,
    packageManager,
    e2e: asBoolean(merged.e2e, DEFAULT_OPTIONS.e2e),
    docker: asBoolean(merged.docker, DEFAULT_OPTIONS.docker),
    ci: asBoolean(merged.ci, DEFAULT_OPTIONS.ci),
    git: asBoolean(merged.git, DEFAULT_OPTIONS.git),
    install: asBoolean(merged.install, DEFAULT_OPTIONS.install),
  };

  if (normalized.mode === 'frontend') {
    normalized.backend = undefined;
  }

  if (normalized.mode === 'backend') {
    normalized.frontend = undefined;
  }

  validateProjectOptions(normalized);

  return normalized;
}
