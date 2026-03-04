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
    await page.waitForTimeout(700);
    await expect(page.locator('.gallery__track .gallery__slide')).toHaveCount(1);
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
    await page.waitForTimeout(700);
    await expect(page.locator('.gallery__track .gallery__slide')).toHaveCount(1);
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

test.describe('Pre-render кейсов', () => {
  test('кейсы присутствуют в HTML при загрузке', async ({ page }) => {
    const response = await page.goto('/');
    const html = await response.text();
    expect(html).toContain('id="case-1"');
    expect(html).toContain('case-section');
    expect(html).toContain('WINK Music');
  });

  test('нет дубликатов секций после hydrate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const sections = await page.locator('.case-section').count();
    expect(sections).toBe(5);
  });

  test('навигация по кейсам работает при pre-rendered контенте', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#cases').scrollIntoViewIfNeeded();
    await page.locator('.case-nav__link').nth(1).click();
    await page.waitForTimeout(500);
    const case2 = page.locator('#case-2');
    await expect(case2).toBeInViewport();
  });
});
