import path from 'node:path';

import { expect,  type Page, test } from '@playwright/test';

const CSV_FILE_PATH = './test-data/valid.csv';
const IMAGE_FILE_PATH = './test-data/invalid.jpg';

test.describe('Загрузка файлов через FileUploadSection', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('Успешная загрузка CSV через DnD и проверка истории', async ({ page }) => {
        await expect(page.getByText(/или перетащите сюда .csv файл/i)).toBeVisible();

        const dropZone = page.locator('[data-testid="dropzone"]');
        await dropZone.hover();
        await page.dispatchEvent('[data-testid="dropzone"]', 'drop', {
            dataTransfer: await createDataTransfer(page, CSV_FILE_PATH, 'valid.csv'),
        });

        await expect(page.getByText(/файл загружен!/i)).toBeVisible();

        await page.getByRole('button', { name: /Отправить/i }).click();

        await expect(page.getByText(/готово!/i)).toBeVisible({
            timeout: 30000,
        });
        await page.screenshot({
            path: 'screenshots/analytics-valid.png',
            fullPage: true,
        });
        await page.goto('http://localhost:5173/history');
        await expect(page.getByText(/valid\.csv/i)).toBeVisible();
        await page.screenshot({
            path: 'screenshots/history-valid.png',
            fullPage: true,
        });
        await page.getByText(/valid\.csv/i).click();
        await page.screenshot({
            path: 'screenshots/history-modal-valid.png',
            fullPage: true,
        });
    });

    test('Ошибка при загрузке не CSV через DnD', async ({ page }) => {
        await expect(page.getByText(/или перетащите сюда .csv файл/i)).toBeVisible();

        const dropZone = page.locator('[data-testid="dropzone"]');
        await dropZone.hover();
        await page.dispatchEvent('[data-testid="dropzone"]', 'drop', {
            dataTransfer: await createDataTransfer(page, IMAGE_FILE_PATH, 'invalid.jpg'),
        });

        await expect(page.getByText(/Можно загружать только \*.csv файлы/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /Отправить/i })).not.toBeVisible();

        await page.screenshot({
            path: 'screenshots/analytics-invalid.png',
            fullPage: true,
        });
    });

    test('Успешная загрузка CSV через файловый инпут', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByText(/Загрузить файл/i).click();
        const fileChooser = await fileChooserPromise;

        await fileChooser.setFiles(path.join('e2e', CSV_FILE_PATH));

        await expect(page.getByText(/файл загружен!/i)).toBeVisible({
            timeout: 30000,
        });

        await page.getByRole('button', { name: /Отправить/i }).click();

        await expect(page.getByText(/готово!/i)).toBeVisible({
            timeout: 30000,
        });
        await page.screenshot({
            path: 'screenshots/analytics-valid.png',
            fullPage: true,
        });
        await page.goto('http://localhost:5173/history');
        await expect(page.getByText(/valid\.csv/i)).toBeVisible();
        await page.screenshot({
            path: 'screenshots/history-valid.png',
            fullPage: true,
        });
        await page.getByText(/valid\.csv/i).click();
        await page.screenshot({
            path: 'screenshots/history-modal-valid.png',
            fullPage: true,
        });
    });
});

async function createDataTransfer(page: Page, filePath: string, fileName: string) {
    return page.evaluateHandle(
        ({ fileName }) => {
            const dataTransfer = new DataTransfer();
            const file = new File(['test,content'], fileName, { type: 'text/csv' });
            dataTransfer.items.add(file);
            return dataTransfer;
        },
        { filePath, fileName }
    );
}
