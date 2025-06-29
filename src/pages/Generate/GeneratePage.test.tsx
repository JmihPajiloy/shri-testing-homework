import { GeneratePage } from '@pages/Generate/GeneratePage.tsx';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
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
        global.fetch = vi.fn(() => new Promise<Response>((resolve) => setTimeout(() => resolve({ ok: true } as Response), 1000)));

        const button = screen.getByRole('button', {
            name: /Начать генерацию/i,
        })
        await events.click(button);
        await waitFor(() => {
            expect(button).not.toHaveTextContent(/Начать генерацию/i);
        })
    });
    it('Обрабатывает ошибки сервера', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, json: () => ({ error: false}) });
        await events.click(
            screen.getByRole('button', {
                name: /Начать генерацию/i,
            })
        );
        expect(screen.getByText("Неизвестная ошибка при попытке сгенерировать отчёт")).toBeInTheDocument()
    });

    it('Обрабатывает ошибки при отсутствии интернет соединения', async () => {
        global.fetch = vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch!"));
        await events.click(
            screen.getByRole('button', {
                name: /Начать генерацию/i,
            })
        );
        expect(screen.getByText(/Failed to fetch!/i)).toBeInTheDocument()
    });
});
