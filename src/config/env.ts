import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const testEnvName = process.env.TEST_ENV ?? 'dev';
const envFile = path.resolve(process.cwd(), 'env', `.env.${testEnvName}`);
const localFile = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envFile)) {
  throw new Error(
    `Environment file not found: ${envFile}. Copy env/.env.example to env/.env.${testEnvName}.`,
  );
}

const layered: Record<string, string> = {};
for (const filePath of [envFile, localFile]) {
  if (!fs.existsSync(filePath)) continue;
  Object.assign(layered, dotenv.parse(fs.readFileSync(filePath)));
}

for (const [key, value] of Object.entries(layered)) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set it in env/.env.${testEnvName} or .env.`);
  }
  return value;
}

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`${name} must be a number. Received "${raw}".`);
  }
  return value;
}

export const env = {
  name: process.env.TEST_ENV ?? testEnvName,
  baseUrl: required('BASE_URL'),
  apiBaseUrl: required('API_BASE_URL'),
  locale: process.env.LOCALE ?? 'en-US',
  timezone: process.env.TIMEZONE ?? 'Asia/Kolkata',
  timeouts: {
    action: numberFromEnv('ACTION_TIMEOUT', 15_000),
    navigation: numberFromEnv('NAVIGATION_TIMEOUT', 30_000),
    expect: numberFromEnv('EXPECT_TIMEOUT', 10_000),
  },
};
