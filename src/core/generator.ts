import { existsSync } from 'node:fs';
import { access, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { logger } from '../utils/logger.js';
import { copyTemplateDir } from '../render/copy.js';
import { createGenerationContext } from './context.js';
import type { GenerationContext, ProjectOptions, TemplateLayer } from './types.js';

const execFileAsync = promisify(execFile);

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureTargetDirectory(targetDir: string): Promise<void> {
  if (!(await pathExists(targetDir))) {
    await mkdir(targetDir, { recursive: true });
    return;
  }

  const entryStat = await stat(targetDir);

  if (!entryStat.isDirectory()) {
    throw new Error(`目标路径不是目录：${targetDir}`);
  }

  const files = await readdir(targetDir);

  if (files.length > 0) {
    throw new Error(`目标目录非空：${targetDir}`);
  }
}

function resolveTemplatesRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  let probeDir = currentDir;

  for (let depth = 0; depth < 5; depth += 1) {
    const candidates = [
      path.join(probeDir, 'templates'),
      path.join(probeDir, 'src', 'templates'),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    const parentDir = path.dirname(probeDir);
    if (parentDir === probeDir) {
      break;
    }

    probeDir = parentDir;
  }

  throw new Error('未找到 templates 目录。');
}

function getTemplateLayers(context: GenerationContext): TemplateLayer[] {
  const root = resolveTemplatesRoot();
  const layers: TemplateLayer[] = [
    {
      name: 'base/common',
      sourceDir: path.join(root, 'base', 'common', 'files'),
    },
  ];

  if (context.options.mode === 'fullstack') {
    layers.push({
      name: 'base/fullstack',
      sourceDir: path.join(root, 'base', 'fullstack', 'files'),
    });
  }

  if (context.options.mode === 'frontend') {
    layers.push({
      name: 'base/frontend-only',
      sourceDir: path.join(root, 'base', 'frontend-only', 'files'),
    });
  }

  if (context.options.mode === 'backend') {
    layers.push({
      name: 'base/backend-only',
      sourceDir: path.join(root, 'base', 'backend-only', 'files'),
    });
  }

  if (context.options.frontend) {
    layers.push({
      name: `frontend/${context.options.frontend}`,
      sourceDir: path.join(root, 'frontend', context.options.frontend, 'files'),
    });
  }

  if (context.options.backend) {
    layers.push({
      name: `backend/${context.options.backend}`,
      sourceDir: path.join(root, 'backend', context.options.backend, 'files'),
    });
  }

  if (context.options.docker) {
    layers.push({
      name: 'addons/docker',
      sourceDir: path.join(root, 'addons', 'docker', 'files'),
    });
  }

  if (context.options.ci) {
    layers.push({
      name: 'addons/ci',
      sourceDir: path.join(root, 'addons', 'ci', 'files'),
    });
  }

  if (context.options.e2e) {
    layers.push({
      name: 'addons/e2e',
      sourceDir: path.join(root, 'addons', 'e2e', 'files'),
    });
  }

  return layers;
}

async function writeCreateMeta(context: GenerationContext): Promise<void> {
  const targetPath = path.join(context.targetDir, '.tooling', 'create-meta.json');
  await mkdir(path.dirname(targetPath), { recursive: true });

  await writeFile(
    targetPath,
    JSON.stringify(
      {
        backend: context.options.backend ?? null,
        ci: context.options.ci,
        createdAt: context.templateData.generatedAt,
        docker: context.options.docker,
        e2e: context.options.e2e,
        frontend: context.options.frontend ?? null,
        mode: context.options.mode,
        packageManager: context.options.packageManager,
        projectName: context.options.projectName,
        tool: '@ymbyte/create-app',
        version: '0.1.0',
      },
      null,
      2,
    ),
    'utf8',
  );
}

async function runPostActions(context: GenerationContext): Promise<void> {
  if (context.options.install) {
    logger.info('正在安装依赖...');

    try {
      await execFileAsync(context.options.packageManager, ['install'], {
        cwd: context.targetDir,
      });
      logger.success('依赖安装完成。');
    } catch (error) {
      logger.warn(`依赖安装失败，请稍后手动执行 pnpm install。\n${String(error)}`);
    }
  }

  if (context.options.git) {
    logger.info('正在初始化 Git 仓库...');

    try {
      await execFileAsync('git', ['init'], {
        cwd: context.targetDir,
      });
      logger.success('Git 仓库初始化完成。');
    } catch (error) {
      logger.warn(`Git 初始化失败，请稍后手动执行 git init。\n${String(error)}`);
    }
  }
}

export async function generateProject(cwd: string, options: ProjectOptions): Promise<string> {
  const targetDir = path.resolve(cwd, options.projectName);
  await ensureTargetDirectory(targetDir);

  const context = createGenerationContext(cwd, targetDir, options);
  const layers = getTemplateLayers(context);

  logger.info(`开始生成项目：${options.projectName}`);

  for (const layer of layers) {
    logger.info(`应用模板层：${layer.name}`);
    await copyTemplateDir(layer.sourceDir, targetDir, context.templateData);
  }

  await writeCreateMeta(context);
  await runPostActions(context);

  logger.success(`项目已生成到 ${targetDir}`);

  return targetDir;
}
