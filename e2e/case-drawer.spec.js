import { test, expect } from '@playwright/test';

test.describe('Drawer достижений', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#cases').scrollIntoViewIfNeeded();
  });

  test('открывается по клику на превью кейса', async ({ page }) => {
    const screens = page.locator('.case-section__screens[data-achievements]').first();
    await screens.waitFor({ state: 'visible', timeout: 5000 });
    await screens.click();

    const drawer = page.locator('.case-drawer.is-open');
    await expect(drawer).toBeVisible();
    await expect(page.locator('#case-drawer-title')).toContainText('Достижения');
    await expect(page.locator('.case-drawer__body .case-drawer__text').first()).toBeVisible();
  });

  test('открывается по ссылке «Подробнее»', async ({ page }) => {
    const openDrawer = page.locator('.case-drawer.is-open');
    if (await openDrawer.isVisible()) {
      await page.locator('.case-drawer__close').click();
    }
    const more = page.locator('.case-section__more').first();
    await more.waitFor({ state: 'visible', timeout: 5000 });
    await more.click();

    await expect(page.locator('.case-drawer.is-open')).toBeVisible();
    await expect(page.locator('.case-drawer__body .case-drawer__text').first()).toBeVisible();
  });

  test('закрывается по кнопке', async ({ page }) => {
    await page.locator('.case-section__screens[data-achievements]').first().click();
    await expect(page.locator('.case-drawer.is-open')).toBeVisible();

    await page.locator('.case-drawer__close').click();
    await expect(page.locator('.case-drawer.is-open')).toHaveCount(0);
  });

  test('закрывается по Escape', async ({ page }) => {
    await page.locator('.case-section__screens[data-achievements]').first().click();
    await expect(page.locator('.case-drawer.is-open')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.case-drawer.is-open')).toHaveCount(0);
  });

  test('body получает case-drawer-open при открытом drawer', async ({ page }) => {
    await page.locator('.case-section__screens[data-achievements]').first().click();
    await expect(page.locator('body')).toHaveClass(/case-drawer-open/);
  });
});

test.describe('Drawer достижений на мобильном', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('панель ~80vw', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#cases').scrollIntoViewIfNeeded();
    await page.locator('.case-section__screens[data-achievements]').first().click();

    const panel = page.locator('.case-drawer__panel');
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    const vw = 390;
    expect(box.width).toBeGreaterThan(vw * 0.75);
    expect(box.width).toBeLessThanOrEqual(vw * 0.82);
  });
});

test.describe('Pre-render кейсов', () => {
  test('кейсы и data-achievements в HTML при загрузке', async ({ page }) => {
    const response = await page.goto('/');
    const html = await response.text();
    expect(html).toContain('id="case-1"');
    expect(html).toContain('case-section');
    expect(html).toContain('data-achievements');
    expect(html).toContain('case-section__more');
    expect(html).toContain('WINK Music');
  });

  test('нет дубликатов секций после hydrate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const sections = await page.locator('.case-section').count();
    expect(sections).toBe(5);
  });
});
