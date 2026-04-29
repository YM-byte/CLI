import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { generateProject } from '../src/core/generator.js';
import type { ProjectOptions } from '../src/core/types.js';

const tempDirs: string[] = [];

afterEach(async () => {
  for (const dir of tempDirs.splice(0)) {
    await rm(dir, { force: true, recursive: true });
  }
});

describe('generateProject', () => {
  it('生成基础 Monorepo 骨架', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'ym-cli-'));
    tempDirs.push(cwd);

    const options: ProjectOptions = {
      backend: 'nestjs',
      ci: false,
      docker: false,
      e2e: false,
      frontend: 'nextjs',
      git: false,
      install: false,
      mode: 'fullstack',
      packageManager: 'pnpm',
      projectName: 'demo-app',
    };

    const targetDir = await generateProject(cwd, options);
    const readme = await readFile(path.join(targetDir, 'README.md'), 'utf8');
    const webPackage = await readFile(path.join(targetDir, 'apps/web/package.json'), 'utf8');
    const serverPackage = await readFile(path.join(targetDir, 'apps/server/package.json'), 'utf8');

    expect(targetDir).toContain('demo-app');
    expect(readme).toContain('demo-app');
    expect(readme).toContain('全栈');
    expect(webPackage).toContain('"next"');
    expect(serverPackage).toContain('"@nestjs/common"');
  });

  it('生成 react-vite + fastify 组合', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'ym-cli-'));
    tempDirs.push(cwd);

    const options: ProjectOptions = {
      backend: 'fastify',
      ci: false,
      docker: false,
      e2e: false,
      frontend: 'react-vite',
      git: false,
      install: false,
      mode: 'fullstack',
      packageManager: 'pnpm',
      projectName: 'demo-react-fastify',
    };

    const targetDir = await generateProject(cwd, options);
    const webPackage = await readFile(path.join(targetDir, 'apps/web/package.json'), 'utf8');
    const serverPackage = await readFile(path.join(targetDir, 'apps/server/package.json'), 'utf8');

    expect(webPackage).toContain('"antd"');
    expect(serverPackage).toContain('"fastify"');
  });

  it('生成 springboot 目录结构与包路径', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'ym-cli-'));
    tempDirs.push(cwd);

    const options: ProjectOptions = {
      backend: 'springboot',
      ci: false,
      docker: false,
      e2e: false,
      frontend: undefined,
      git: false,
      install: false,
      mode: 'backend',
      packageManager: 'pnpm',
      projectName: 'eagle-core',
    };

    const targetDir = await generateProject(cwd, options);
    const pom = await readFile(path.join(targetDir, 'apps/server/pom.xml'), 'utf8');
    const application = await readFile(
      path.join(
        targetDir,
        'apps/server/src/main/java/com/ym/eaglecore/EagleCoreApplication.java',
      ),
      'utf8',
    );

    expect(pom).toContain('spring-boot-starter-web');
    expect(application).toContain('package com.ym.eaglecore;');
    expect(application).toContain('class EagleCoreApplication');
  });
});
