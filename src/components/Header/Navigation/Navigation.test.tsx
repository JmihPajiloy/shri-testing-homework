import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Navigation } from './Navigation';

describe('Навигация по страницам', () => {
    afterEach(() => {
        cleanup();
    })

    beforeEach(() => {
        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );
    })

    it('переходит на страницу аналитики', async () => {
        const link = screen.getByRole('link', { name: /CSV Аналитик/i });
        expect(link).toHaveAttribute('href', '/');
    });

    it('переходит на страницу генерации', async () => {
        const link = screen.getByRole('link', { name: /CSV Генератор/i });
        expect(link).toHaveAttribute('href', '/generate');
    });

    it('переходит на страницу истории', async () => {
        const link = screen.getByRole('link', { name: /История/i });
        expect(link).toHaveAttribute('href', '/history');
    });
});
