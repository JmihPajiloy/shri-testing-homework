import { GeneratePage } from '@pages/Generate/GeneratePage.tsx';
import { cleanup, render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Страница генерации', () => {
    beforeEach(() => {
        render(<GeneratePage />);
    });
    afterEach(() => {
        cleanup();
    });

    it('При клике на кнопку отправляется запрос за генерацией', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });

        await events.click(
            screen.getByRole('button', {
                name: /Начать генерацию/i,
            })
        );

        expect(fetch).toHaveBeenCalledOnce();
    });
    it('При клике на кнопку автоматически начинается загрузка файла', async () => {
        await events.click(
            screen.getByRole('button', {
                name: /Начать генерацию/i,
            })
        );
        expect(screen.getByText(/идёт процесс генерации/i)).toBeInTheDocument();
    });
    it.skip('Обрабатывает ошибки сервера', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
        await events.click(
            screen.getByRole('button', {
                name: /Начать генерацию/i,
            })
        );
    });

    it.skip('Обрабатывает ошибки при отсутствии интернет соединения', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
        await events.click(
            screen.getByRole('button', {
                name: /Начать генерацию/i,
            })
        );
    });
});
