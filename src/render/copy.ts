import { chmod, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { renderTemplate } from './ejs.js';

function renderPathSegment(segment: string, data: Record<string, string | boolean>): string {
  return segment.replace(/__([a-zA-Z0-9_]+)__/g, (_match, key: string) => {
    const value = data[key];
    return value === undefined ? key : String(value);
  });
}

function renderTargetPath(targetPath: string, data: Record<string, string | boolean>): string {
  const segments = targetPath.split(path.sep).map((segment) => renderPathSegment(segment, data));
  return segments.join(path.sep);
}

async function copyEntry(
  sourcePath: string,
  targetPath: string,
  data: Record<string, string | boolean>,
): Promise<void> {
  const renderedTargetPath = renderTargetPath(targetPath, data);
  const entryStat = await stat(sourcePath);

  if (entryStat.isDirectory()) {
    await mkdir(renderedTargetPath, { recursive: true });
    const entries = await readdir(sourcePath);

    for (const entry of entries) {
      await copyEntry(path.join(sourcePath, entry), path.join(renderedTargetPath, entry), data);
    }

    return;
  }

  const content = await readFile(sourcePath, 'utf8');
  const rendered = renderTemplate(content, data);
  await mkdir(path.dirname(renderedTargetPath), { recursive: true });
  await writeFile(renderedTargetPath, rendered, 'utf8');

  if (renderedTargetPath.includes(`${path.sep}.husky${path.sep}`)) {
    await chmod(renderedTargetPath, 0o755);
  }
}

export async function copyTemplateDir(
  sourceDir: string,
  targetDir: string,
  data: Record<string, string | boolean>,
): Promise<void> {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir);

  for (const entry of entries) {
    await copyEntry(path.join(sourceDir, entry), path.join(targetDir, entry), data);
  }
}
