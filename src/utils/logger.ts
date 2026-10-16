import fs from 'node:fs';
import path from 'node:path';

const logFile = path.resolve(process.cwd(), 'logs', 'test.log');
fs.mkdirSync(path.dirname(logFile), { recursive: true });

function write(level: 'INFO' | 'ERROR', message: string): void {
  const line = `${new Date().toISOString()} [${level}] ${message}`;
  if (level === 'ERROR') {
    console.error(line);
  } else {
    console.log(line);
  }
  fs.appendFileSync(logFile, `${line}\n`);
}

export const logger = {
  info(message: string): void {
    write('INFO', message);
  },
  error(message: string): void {
    write('ERROR', message);
  },
};
