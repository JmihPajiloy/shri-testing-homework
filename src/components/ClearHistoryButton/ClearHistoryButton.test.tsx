import * as historyStoreModule from '@store/historyStore';
import { cleanup, render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import * as storageModule from '@utils/storage';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ClearHistoryButton } from './ClearHistoryButton';

vi.mock('@store/historyStore', () => ({
    useHistoryStore: vi.fn(),
}));

vi.mock('@utils/storage', async () => ({
    ...(await vi.importActual('@utils/storage')),
    clearHistoryStorage: vi.fn(),
}));

const mockUseHistoryStore = vi.mocked(historyStoreModule.useHistoryStore);
const mockClearHistoryStorage = vi.spyOn(storageModule, 'clearHistory').mockImplementation(() => {});
describe('Кнопка "Очистить всё"', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseHistoryStore.mockReturnValue({
            history: [],
            clearHistory: vi.fn(),
        });
    });

    afterEach(() => {
        cleanup();
    });

    it('не отображается, когда история пуста', () => {
        render(<ClearHistoryButton />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('отображается, когда история не пуста', () => {
        const mockClearHistory = vi.fn();

        mockUseHistoryStore.mockReturnValueOnce({
            history: [{ id: '1', name: 'item-1' }],
            clearHistory: mockClearHistory,
        });
        render(<ClearHistoryButton />);
        expect(screen.getByRole('button', { name: /Очистить всё/i })).toBeInTheDocument();
    });

    it('вызывает функции очистки при клике', async () => {
        const mockClearHistory = vi.fn();

        vi.spyOn(historyStoreModule, 'useHistoryStore').mockReturnValueOnce({
            history: [{ id: '1', name: 'Test' }],
            clearHistory: mockClearHistory,
        });
        render(<ClearHistoryButton />);
        const button = screen.getByRole('button', { name: 'Очистить всё' });
        await events.click(button);
        expect(mockClearHistoryStorage).toHaveBeenCalledTimes(1);
        expect(mockClearHistory).toHaveBeenCalledTimes(1);
    });
});
