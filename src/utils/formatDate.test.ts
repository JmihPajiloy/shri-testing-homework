import { describe, it, expect } from 'vitest';

import { formatDate } from './formatDate';

describe('formatDate', () => {
    it('форматирует миллисекунды в строку DD.MM.YYYY', () => {
        const timestamp = 1672531200000;
        expect(formatDate(timestamp)).toBe('01.01.2023');
    });

    it('форматирует объект Date в строку DD.MM.YYYY', () => {
        const date = new Date(2023, 11, 31);
        expect(formatDate(date)).toBe('31.12.2023');
    });

    it('добавляет ведущие нули для дней и месяцев', () => {
        const date = new Date(2023, 0, 5);
        expect(formatDate(date)).toBe('05.01.2023');
    });

    it('корректно обрабатывает високосный год (29 февраля)', () => {
        const date = new Date(2024, 1, 29);
        expect(formatDate(date)).toBe('29.02.2024');
    });

    it('корректно обрабатывает начало эпохи (1 января 1970)', () => {
        const timestamp = 0;
        expect(formatDate(timestamp)).toBe('01.01.1970');
    });

    it('корректно обрабатывает даты до 1970 года', () => {
        const date = new Date(1969, 11, 31);
        expect(formatDate(date)).toBe('31.12.1969');
    });

    it('корректно обрабатывает даты далекого прошлого', () => {
        const date = new Date(1492, 3, 12);
        expect(formatDate(date)).toBe('12.04.1492');
    });

    it('корректно обрабатывает даты в будущем', () => {
        const date = new Date(2100, 0, 1);
        expect(formatDate(date)).toBe('01.01.2100');
    });

    it('корректно обрабатывает граничные значения месяцев', () => {
        const january = new Date(2025, 0, 15);
        expect(formatDate(january)).toBe('15.01.2025');

        const december = new Date(2025, 11, 15);
        expect(formatDate(december)).toBe('15.12.2025');
    });

    it('корректно обрабатывает граничные значения дней', () => {
        const firstDay = new Date(2025, 5, 1);
        expect(formatDate(firstDay)).toBe('01.06.2025');

        const lastDay = new Date(2025, 5, 30);
        expect(formatDate(lastDay)).toBe('30.06.2025');
    });
});