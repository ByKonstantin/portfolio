import { test, expect } from '@playwright/test';

test.describe('Галерея', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#cases').scrollIntoViewIfNeeded();
  });

  test('открывается по клику на экраны кейса', async ({ page }) => {
    const screens = page.locator('.case-section__screens[data-gallery]').first();
    await screens.waitFor({ state: 'visible', timeout: 5000 });
    await screens.click();

    const gallery = page.locator('.gallery[aria-hidden="false"]');
    await expect(gallery).toBeVisible();
    await expect(page.locator('.gallery__track img')).toBeVisible();
  });

  test('закрывается по кнопке', async ({ page }) => {
    await page.locator('.case-section__screens[data-gallery]').first().click();
    await expect(page.locator('.gallery[aria-hidden="false"]')).toBeVisible();

    await page.locator('.gallery__close').click();
    await expect(page.locator('.gallery[aria-hidden="true"]')).toBeVisible();
  });

  test('закрывается по Escape', async ({ page }) => {
    await page.locator('.case-section__screens[data-gallery]').first().click();
    await expect(page.locator('.gallery[aria-hidden="false"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.gallery[aria-hidden="true"]')).toBeVisible();
  });

  test('при одном слайде scroll-snap отключён', async ({ page }) => {
    await page.locator('.case-section__screens[data-gallery]').first().click();
    const track = page.locator('.gallery__track');
    await expect(track).toBeVisible();

    const snapType = await track.evaluate((el) => getComputedStyle(el).scrollSnapType);
    expect(snapType).toBe('none');
  });

  test('body получает gallery-open при открытой галерее', async ({ page }) => {
    await page.locator('.case-section__screens[data-gallery]').first().click();
    await expect(page.locator('body')).toHaveClass(/gallery-open/);
  });
});

test.describe('Галерея на мобильном', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('открывается и отображает изображение', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('.case-section__screens[data-gallery]').first().click();
    const gallery = page.locator('.gallery[aria-hidden="false"]');
    await expect(gallery).toBeVisible();

    const img = page.locator('.gallery__slide img');
    await expect(img).toBeVisible();
  });

  test('мобильные стили галереи применяются (dvh, padding)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cases').scrollIntoViewIfNeeded();
    await page.locator('.case-section__screens[data-gallery]').first().click();
    const track = page.locator('.gallery__track');
    await expect(track).toBeVisible();
    const padding = await track.evaluate((el) => getComputedStyle(el).padding);
    expect(parseInt(padding, 10)).toBeGreaterThan(0);
  });
});
