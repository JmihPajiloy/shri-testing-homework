import { test, expect } from '@playwright/test';

test('Скачивание csv файла после клика на кнопку "Начать генерацию"', async ({ page }) => {
    await page.goto('http://localhost:5173/generate');

    const generateButton = page.getByRole('button', { name: /Начать генерацию/i });
    await expect(generateButton).toBeVisible();

    await generateButton.click();

    const download = await page.waitForEvent('download');

    const fileName = download.suggestedFilename();
    expect(fileName).toMatch(/\.csv$/);
});