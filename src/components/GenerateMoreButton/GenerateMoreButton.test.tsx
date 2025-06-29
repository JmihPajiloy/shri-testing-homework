import { render, screen } from '@testing-library/react';
import events from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GenerateMoreButton } from './GenerateMoreButton.tsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
        ...mod,
        useNavigate: () => mockNavigate,
    };
});

describe('Кнопка "Сгенерировать больше"', () => {
    it('переходит на "/generate"', async () => {
        render(<GenerateMoreButton />);
        const button = screen.getByRole('button', { name: /Сгенерировать больше/i });
        await events.click(button);
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockNavigate).toHaveBeenCalledWith('/generate');
    });
});
