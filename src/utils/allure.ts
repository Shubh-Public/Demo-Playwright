import * as allure from 'allure-js-commons';
import { logger } from './logger';

export type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

export type CaseMeta = {
  epic: string;
  feature: string;
  story: string;
  severity?: Severity;
  owner?: string;
  description?: string;
};

export async function meta(details: CaseMeta): Promise<void> {
  await allure.epic(details.epic);
  await allure.feature(details.feature);
  await allure.story(details.story);
  await allure.severity(details.severity ?? 'normal');
  await allure.owner(details.owner ?? 'qa-team');
  if (details.description) {
    await allure.description(details.description);
  }
}

export async function parameter(name: string, value: string): Promise<void> {
  await allure.parameter(name, value);
}

export async function step<T>(name: string, action: () => Promise<T>): Promise<T> {
  logger.info(`STEP ${name}`);
  return await allure.step(name, action);
}
