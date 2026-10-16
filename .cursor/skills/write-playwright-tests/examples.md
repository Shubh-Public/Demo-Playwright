# Templates

Replace the example names with the real screen. Keep the imports, `meta()`, tags, fixture registration, and `step()` calls.

## Page

`src/pages/home.page.ts`

```typescript
import type { Locator, Page } from '@playwright/test';
import { step } from '../utils/allure';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
  }

  async open(): Promise<void> {
    await step('Open home', async () => {
      await this.goto('/');
    });
  }

  title(): Locator {
    return this.heading;
  }
}
```

## Fixture registration

Add the page to `Fixtures` and to `base.extend` in `src/fixtures/test.fixture.ts`:

```typescript
homePage: async ({ page }, use) => {
  await use(new HomePage(page));
},
```

## Guest spec

`tests/guest/home.spec.ts`

```typescript
import { expect, test } from '../../src/fixtures/test.fixture';
import { meta } from '../../src/utils/allure';

test.describe('Home', () => {
  test('shows the main heading', { tag: ['@smoke'] }, async ({ homePage }) => {
    await meta({
      epic: 'Web',
      feature: 'Home',
      story: 'Main heading is visible',
      severity: 'critical',
    });

    await homePage.open();
    await expect(homePage.title()).toBeVisible();
  });
});
```

Logged-in flows use the same shape under `tests/e2e/` and receive the signed-in `page` once storage state is configured.

## API client, schema, and spec

`src/api/schemas/item.schema.ts`

```typescript
import { z } from 'zod';

export const itemSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export type Item = z.infer<typeof itemSchema>;
```

`src/api/items.client.ts`

```typescript
import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ItemsClient {
  constructor(private readonly request: APIRequestContext) {}

  getItem(id: number): Promise<APIResponse> {
    return this.request.get(`/items/${id}`);
  }
}
```

Register `itemsClient` with `new ItemsClient(apiContext)`.

`tests/api/items.spec.ts`

```typescript
import { expect, test } from '../../src/fixtures/test.fixture';
import { itemSchema } from '../../src/api/schemas/item.schema';
import { meta, parameter } from '../../src/utils/allure';

test.describe('Items API', () => {
  test('returns one item', { tag: ['@regression'] }, async ({ itemsClient }) => {
    await meta({
      epic: 'API',
      feature: 'Items',
      story: 'Get item by id',
      severity: 'critical',
    });
    await parameter('itemId', '1');

    const response = await itemsClient.getItem(1);
    expect(response.status()).toBe(200);
    expect(itemSchema.parse(await response.json()).id).toBe(1);
  });
});
```

## Data file

`test-data/search.json`, then `readJson<SearchCase[]>('test-data/search.json')` inside the spec. Loop the rows with `test()` and call `parameter()` for each input.

## Accessibility

Put the spec in `tests/guest` or `tests/e2e`, tag `@a11y`, and scan with `@axe-core/playwright` after the page action. Assert `violations` is empty for the rules you enable.
