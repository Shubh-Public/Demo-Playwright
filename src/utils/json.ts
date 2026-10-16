import fs from 'node:fs';
import path from 'node:path';

export function readJson<T>(relativePath: string): T {
  const fullPath = path.resolve(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as T;
}
